# OIDC authentication app using React and Cloudentity Authorization Platfomr as OIDC provider

TODO: Fill with general concepts

### Pre-requsisites

We will be using `react` for the application development.

```bash
- [npm](https://docs.npmjs.com/getting-started) - Recommended v8.3.0 +
```

### Initialize React app

```bash
npx create-react-app oidc-auth-sample-app
```

And install required packages

* mui - [Material ui for icons, styles, fonts](https://mui.com/getting-started/installation/)
* react - core react functions
* cloudentity/auth - Cloudentity JS sdk to fetch and store OAuth accessTokens

```bash
npm install --save react-router-dom
npm install --save @cloudentity/auth
npm install --save jwt-decode
```

### Define React components

#### Routing

For this react application, let's define the routing for various resources.
As per this sample application, we will have
* page that does not require authorization (/ page)
* element that allows user to authorize (auth function within / page)
* page that requires authorization (/usertweet)
  ** if there is no user authorization, the user will be redirected to / page

So in our application routing, let's define the router and the auth redirects. We will use
the Cloudentity Auth sdk to handle OAuth authorization (code => token exchange), redirects and
setting of the `accessToken`. If an `accessToken` is not available in the local storage, user
will be redirected to the page where they can see the `authorize` button and contents that
do not require authorized tokens.

In `index.js`, located in the `src` directory of the app, we'll add:

```js
function App() {

  //const navigate = useNavigate();
  const cloudentity = new CloudentityAuth(authConfig);
  const [authenticated] = useAuth(cloudentity);
  const accessTokenRaw = localStorage.getItem(authConfig.accessTokenName);
  const auth = authenticated && accessTokenRaw;

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/usertweet"  element={!auth ?<HomePageContent auth={auth} /> : <Navigate to='/usertweet' /> }></Route>
          </Route>
          <Route path="/"  element={!auth ? <HomePageContent auth={auth} /> : <Navigate to='/usertweet' /> }>
          </Route>
        </Routes>
      </div>
    </Router>
  );

}

```

So as you can see the public page is at `HomePageContent` that is served by `homepage.js`. Let's dive into that
snippet for some explanation.

#### Homepage

`homepage.js` contains mainly two main elements of interest other than navigation and style elements
 * `authorize` button   => Calls to Cloudentity authorization platform to authorize the user
 * `Latest tweets` element => Unprotected GraphQL API call



#### Getting an OIDC token from Cloudentity Platform


>> Insert signing up for SaaS content from the GraphQL article

We will use the [Cloudentity OAuth JS SDK](https://github.com/cloudentity/cloudentity-auth-js) to perform an OAuth handshake with Cloudentity authorization platform and fetch an authorizationToken.

`authButton.js`

```js
import CloudentityAuth from '@cloudentity/auth';
import authConfig from './authConfig.js';

export const AuthButton = ({auth}) => {

  const classes = useStyles();

  const handleAuth = () => {
    const scopes = 'all';
    console.log(authConfig);
    const cloudentity = new CloudentityAuth({...authConfig, ...scopes});
    cloudentity.authorize();
  };

  const buttonOnClick = () => {
    handleAuth();
  }

  return (
    <div className={classes.root} >
      <Stack className={classes.mainSection} direction="column" justifyContent="center" alignItems="center">
        <p>If you want to see more than this, we need to identity and authorize you further.
        <h3>Let's get you in there!</h3>
        </p>
        <Tooltip title="This will intiate OAuth authorization request with Cloudentity ACP" placement="top">
          <Button className="AuthenticateButton" variant="contained" onClick={() => buttonOnClick()}>Authorize</Button>
        </Tooltip>
      </Stack>
    </div>
  );

}
```

* Proxy to eliminate CORS error

By default you will run into CORS error as the GraphQL APIs are served on a different host/port. To eliminate this we will use the React dev proxy to proxy all requests to GraphQL API server.

`package.json`

```json
{
  "proxy": "http://localhost:5001",
}
```

### Register the application in Cloudentity authorization platform

To consume any resources protect by Cloudentity authorization server, the consuming applications must first register themselves in the Cloudentity authorization
platform. As a quick reminder we will be used open standard based OAuth flows for all this integrations.

So get into the Cloudentity portal and register a single page client application.[Follow this Cloudentity article to register a client
application in Cloudentity authorization platform](https://docs.authorization.cloudentity.com/guides/developer/protect/application/)

Now that we have a registered client application, we will feed that into the configuration settings for the application we have been building.

In `authConfig.ts`,

This file contains the configuration required to handshake with Cloudentity authorization platform to obtain an accessToken to consume resources on behalf of
an end user. The underlying Cloudentity SDK uses the authorization code grant with PKCE flow to get the accessToken. [Read more about the OAuth PKCE flow](https://docs.authorization.cloudentity.com/features/oauth/grant_flows/auth_code_with_pkce/).


```js
const authConfig = {
    domain: 'rtest.authz.cloudentity.io', // e.g. 'example.demo.cloudentity.com.' Recommended; always generates URLs with 'https' protocol.
     // baseUrl: optional alternative to 'domain.' Protocol required, e.g. 'https://example.demo.cloudentity.com.'
     // In situations where protocol may dynamically resolve to 'http' rather than 'https' (for example in dev mode), use 'baseUrl' rather than 'domain'.
     tenantId: 'rtest',
     authorizationServerId: 'ce-dev-playground-integrations',
     clientId: 'c7e6u0eer3qh0m4pggig',
     redirectUri: 'http://localhost:3000/',
     silentAuthRedirectUri: 'window.location.href' + '/silent', // optional setting to redirect to a different endpoint following successful silent auth flow
     userInfoUri: 'https://rtest.authz.cloudentity.io/rtest/ce-dev-playground-integrations/userinfo', // optional, for fetching user info via API
     scopes: ['profile', 'email', 'openid'], // 'revoke_tokens' scope must be present for 'logout' action to revoke token! Without it, token will only be deleted from browser's local storage.
     letClientSetAccessToken: true,
     accessTokenName: 'ins_demo_access_token', // optional; defaults to '{tenantId}_{authorizationServerId}_access_token'
     idTokenName: 'ins_demo_id_token', // optional; defaults to '{tenantId}_{authorizationServerId}_id_token'

 };

export default authConfig;

```

Now that we have everything configured and ready to go, let's run the application and test it out.

### Run the application

```
npm start
```

```js
http://localhost:3001
```


### Exercise for the readers

Now you can play around with various policies protecting the GraphQL API resources and see how the application handles various pieces and responds with etc.
We hope this was an educational journey to clearly understand how the Cloudentity authorization solution can be used easily to solve the 
complex authorization requirements within your organization. Feel free to contribute any modifications to the demo applications and concepts back to repo for 
new readers to explore and understand. Happy learning!

### Conclusion

This wraps up the tutorial for a sample GraphQL client server application protected using the Cloudentity Authorization platform.
In this series, you would have accomplished following things:
 * Develop a simple GraphQL service
 * Protect the GraphQL service API resources with Cloudentity Authorization Platform
 * Develop a simple GraphQL client application
 * Fetch authorization tokens from Cloudentity Authorization Platform and pass from the client app to the protected server resource
 * Dynamically change the protected server resource policy in ACP to control client app GraphQL API data access.
