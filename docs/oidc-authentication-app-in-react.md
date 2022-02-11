# OIDC authentication app using React and Cloudentity Authorization Platform as OIDC provider

In this article, we will be creating a simple client front-end app with React to demonstrate a login and profile view flow that uses the Cloudentity Authorization Platform as the OIDC provider.

### Prerequisites

**OIDC application**

To get started, you will need to configure an OIDC client in Cloudentity Authorization Control Plane (ACP). We will be used open standard-based OAuth flows for this example.

If you have not signed up for Cloudentity ACP, you can create a [free account](https://authz.cloudentity.io/register).

Once you have created your account and are on the main dashboard, make a note of the workspace that is currently selected. The workspace is shown in the top of the left-hand navigation menu. Usually if you have just signed up, it will be called "Demo." We will be using this workspace for this article, but you can create your own if you want. We will need the workspace name later to configure our client front-end app.

Now go to Applications > Clients and click on "Create Application." Choose a name (we will be using 'react-demo' for this example) and select "Single Page" for the application type.

It is fine to leave most settings as they are. However, we will need to set up a redirect URI to ensure the handshake with our React application works. By default, a React app created with the `create-react-app` tool runs its dev server at `http://localhost:3000/`, so let's add that to the "Redirect URI" field and click "Save." We're now ready to start on our React app.

For full instructions, [see this article to register a client application in the Cloudentity authorization platform.](https://docs.authorization.cloudentity.com/guides/developer/protect/application/).

**React app prerequisites**

- [Node.js](https://nodejs.org) - Recommended v16.x +
- [npm](https://docs.npmjs.com/getting-started) - Recommended v8.x +

### Initialize React app

```bash
npx create-react-app oidc-auth-sample-app
cd oidc-auth-sample-app
```

We'll install packages required for minimal functionality:

* react-router-dom - client-side routing for react
* cloudentity/auth - Cloudentity JS SDK to fetch and store OAuth accessTokens
* jwt-decode - decode JWT tokens, such as OAuth access and id tokens

```bash
npm install --save react-router-dom @cloudentity/auth jwt-decode
```

### Define React components

To keep our app organized, let's create a `components` directory. Then we'll create a couple component files:

```bash
mkdir src/components
touch src/components/Login.js src/components/Profile.js
```

The Login.js will be our view for unauthenticated traffic, and Profile.js will be for authenticated users.

#### Routing

We'll use `react-router-dom` to handle routing.

The index route (`/`) will not require authorization. Users who are not authorized will be redirected to this route.

The profile route (`/profile`) will require authorization to access. After login, authorized users will be redirected to this route.

Let's set up an extremely simple login and profile page with `/` and `/profile` routes pointing to them. At this point, anyone can visit them without authorization.

We'll modify the `src/App.js` to look like this:

```js
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Login from './components/Login';
import Profile from './components/Profile';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
```

We'll focus on functionality rather than styling for this example, but it will help to at least give our app content some basic centering.
In `src/App.css`, we'll modify the `App` class to look like this, and discard everything else:

```css
.App {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
```

Now we add some very basic content to the Login and Profile components.

In src/components/Login.js:

```js
const Login = () => {
  return (
    <div>
      <h1>Welcome!</h1>
      <button>
        Please log in.
      </button>
    </div>
  );
};

export default Login;
```

In src/components/Profile.js:

```js
const Profile = () => {
  return (
    <div>
      <h1>Welcome, { /* we'll dynamically populate this soon */ 'user' }!</h1>
      <h3>
        Your profile info:
      </h3>
      <div>
        { /* we'll dynamically populate this soon */ }
      </div>
    </div>
  );
};

export default Profile;
```

Start the dev server:

```bash
npm start
```

Now if you go to localhost:3000, you'll see the Login view, and if you go directly to localhost:3000/profile, you'll see the Profile view. Good start; now let's protect our Profile view and wire it up to !

Next we'll configure the Cloudentity Auth library in our app, protect the Profile view from unauthorized traffic, and ensure authorized and non-authorized users get redirected to the correct route.

First, we need to set up a config file that will contain our Cloudentity ACP OAuth application values, and a file for an auth hook that we can use in our components to check whether the user is authorized to access a certain view.

```bash
touch src/authConfig.js src/auth.js
```

`src/authConfig.js` contains the configuration required to handshake with the Cloudentity authorization platform to obtain an `accessToken` to consume resources on behalf of an end user, and an `idToken` to provide identity data. The underlying Cloudentity SDK uses the authorization code grant with PKCE flow to get the accessToken. [Read more about the OAuth PKCE flow](https://docs.authorization.cloudentity.com/features/oauth/grant_flows/auth_code_with_pkce/).

In `src/authConfig.js`, replace the example values with values from the OAuth Application you set up at the beginning of this demo:

```js
const authConfig = {
    domain: 'example.authz.cloudentity.io', // e.g. 'example.authz.cloudentity.io.' Recommended; always generates URLs with 'https' protocol.
     // baseUrl: optional alternative to 'domain.' Protocol required, e.g. 'https://example.demo.cloudentity.com.'
     // In situations where protocol may dynamically resolve to 'http' rather than 'https' (for example in dev mode), use 'baseUrl' rather than 'domain'.
     tenantId: 'example', // This is generally in the subdomain of your Cloudentity ACP URL
     authorizationServerId: 'demo', // This is generally the name of the workspace you created the OAuth application in.
     clientId: 'application-client-id-goes-here',
     redirectUri: 'http://localhost:3000/',
     scopes: ['profile', 'email', 'openid'], // 'revoke_tokens' scope must be present for 'logout' action to revoke token! Without it, token will only be deleted from browser's local storage.
     accessTokenName: 'profile_demo_access_token', // optional; defaults to '{tenantId}_{authorizationServerId}_access_token'
     idTokenName: 'profile_demo_id_token', // optional; defaults to '{tenantId}_{authorizationServerId}_id_token'
 };

 export default authConfig;
```

In `src/auth.js`, we'll create a simple hook to manage our authenticated state:

```js
import {useState, useEffect} from 'react';

export const useAuth = (auth) => {
  const [authenticated, setAuthentication] = useState(null);

  function removeQueryString() {
    if (window.location.href.split('?').length > 1) {
      window.history.replaceState({}, document.title, window.location.href.replace(/\?.*$/, ''));
    }
  }

  useEffect(() => {
    auth.getAuth().then((res) => {
      if (res) {
        console.log('auth response:', JSON.stringify(res));
        removeQueryString();
      }
      setAuthentication(true);
    })
    .catch((_authErr) => {
      setAuthentication(false);
      if (window.location.href.split('?error').length > 1) {
        if (authenticated === false) {
          window.alert('The authorization server returned an error.');
        }
      } else {
        removeQueryString();
      }
    });
  });

  return [authenticated];
};
```

Now we can wire an OAuth authentication flow with Cloudentity ACP to our app.
We will use the Cloudentity Auth SDK to handle OAuth authorization (code => token exchange), redirects and
setting the `accessToken`. If an `accessToken` is not available in the local storage, the user
will be redirected to the `/` route, where they will see the "Please log in" button. They will not be able to access the `/profile` route.

Back in `src/App.js`, we'll import the Cloudentity Auth SDK, our config, and auth hook; we'll then add login and logout handlers to pass as props to our Login and Profile components:

```js
// ...

import CloudentityAuth from '@cloudentity/auth';
import authConfig from './authConfig';
import { useAuth } from './auth';

function App() {
  const cloudentity = new CloudentityAuth(authConfig);
  const [authenticated] = useAuth(cloudentity);

  function authorize () {
    cloudentity.authorize();
  };

  function clearAuth () {
    cloudentity.revokeAuth()
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.location.reload();
      });
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login auth={authenticated} handleLogin={authorize} />} />
          <Route path="profile" element={<Profile auth={authenticated} handleLogout={clearAuth} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// ...
```

Now we just need to wire up our Login and Profile components to detect the auth state and redirect if necessary.

In `src/components/Login.js`:

```js
import { Navigate } from 'react-router-dom';

const Login = ({auth, handleLogin}) => {
  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && (
        <div>
          <h1>Welcome!</h1>
          <button onClick={handleLogin}>
            Please log in.
          </button>
        </div>
      )}
      {auth && <Navigate to='/profile' />}
    </div>
  );
};

export default Login;
```

In `src/components/Profile.js`:

```js
import { Navigate } from 'react-router-dom';

const Profile = ({auth, handleLogout}) => {
  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && <Navigate to='/' />}
      {auth && (
        <div>
          <h1>Welcome, { /* we'll dynamically populate this soon */ 'user' }!</h1>
          <h3>
            Your profile info:
          </h3>
          <div>
            { /* we'll dynamically populate this soon */ }
          </div>
          <button onClick={handleLogout} style={{marginTop: 20}}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
```

Note that there is both a `false` and `null` state for `auth`. This is because checking the auth state is asynchronous, so when redirecting to our app after the OAuth handshake, there will be a brief moment where our app has rendered but the auth check is not finished. To handle this, we'll display a message that reads "Loading..." in that brief moment after the successful redirect from the Cloudentity ACP OAuth application.

The one thing remaining is to extract the user's identity data from the OAuth ID token and display it in their profile view. To do this, we'll import the `jwt-decode` library into our Profile page, and add a simple list of profile attributes. Parameters such as `iat` or 'issued at,' which can allow us to display a human-readable last login time, are returned as Unix timestamps and must be converted.

After adding some profile data and minimal styles, here's our finished `src/components/Profile.js` file:

```js
import { Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

const Profile = ({auth, handleLogout}) => {
  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};
  const lastLogin = idTokenData.iat ? (new Date(idTokenData.iat*1000)).toLocaleString() : 'N/A';

  console.log(idTokenData, lastLogin, idTokenData.iat);

  const profileItemStyle = {
    display: 'flex',
    justifyContent: 'space-between'
  };

  const profileLabelStyle = {
    fontWeight: 'bold'
  };

  return (
    <div>
      {auth === null && <div>Loading...</div>}
      {auth === false && <Navigate to='/' />}
      {auth && (
        <div>
          <h1>Welcome, {idTokenData.sub || 'user'}!</h1>
          <h3>
            Your profile info:
          </h3>
          <div style={{marginTop: 20, minWidth: 270}}>
            <div style={profileItemStyle}>
              <div style={profileLabelStyle}>Username:</div>
              <div>{idTokenData.sub}</div>
            </div>
            <div style={profileItemStyle}>
              <div style={profileLabelStyle}>Email:</div>
              <div>{idTokenData.email || 'N/A'}</div>
            </div>
            <div style={profileItemStyle}>
              <div style={profileLabelStyle}>Last login:</div>
              <div>{lastLogin}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{marginTop: 20}}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
```

Now you should see your username, email (if your logged-in user has one configured), and last login time.

This is just the beginning; we can use the `accessToken` as well to call protected API endpoints, which we'll be exploring in another article.

### Conclusion

This wraps up our tutorial for a simple Login and Profile page protected using the Cloudentity Authorization platform.
After going through the tutorial, you will have accomplished the following:
 * Create an OAuth Application with the Cloudentity Authorization Platform
 * Build a simple React UI application with a login and profile page
 * Authorize and set OAuth access and ID tokens in your React app
 * Manage redirects between Login and Profile pages for authorized and unauthorized users
 * Display basic profile info on the profile page for authorized users
