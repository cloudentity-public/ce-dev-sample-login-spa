## About

This is a simple react app to demonstrate authentication of users through any identity providers configured using ACP as identity hub.

ACP can be connect to any identity provider using various mechanisms using: https://docs.authorization.cloudentity.com/guides/workspace_admin/connect/

This app uses an OAuth client application to interact with ACP as OAuth authorization server using Authorization code grant with PKCE flow, and to fetch the access and idToken token in return. These tokens can be utilized to make further api calls(not in scope of this app) or new tokens can be requested based on the integration pattern.

## Usage

### 1. Install the required packages

`yarn install`

This will pull in all required npm packages(defined in `package.json`), which also incldues a Cloudentity specific npm package to handle accessTokens(setting within local storage for further usage, silent refresh etc) within the SPA.

- [Cloudentity auth js npm](https://www.npmjs.com/package/@cloudentity/auth)
- [Cloudentity auth js source reference](https://github.com/cloudentity/cloudentity-auth-js)

### 2. Create Application in ACP

1. Login to ACP and go to Applications -> + CREATE APPLICATION
2. Give the Application a Name (eg Demo SPA)
3. For Application Type choose: Single-page Application
4. Select 'Create'
5. In the overview tab, on the right panel, set a Redirect URI as http://localhost:3000/dashboard
6. Save Changes
7. Go to the OAuth Tab and enable Application Type -> Trusted
8. Go to Scopes Tab, Expand Profile and enable 'Profile' from the list of Scopes
9. Go back to the overview tab and copy the the 'CLIENT ID' from the right panel. This will be pasted into your config in the next step.

### 3. Configure the app

To configure the application to use an ACP instance, navigate to `src/config/authConfig.js` and modify the settings for authConfig to provide appropriate values.

Make sure you have an [OAuth client application created and configured within ACP](https://docs.authorization.cloudentity.com/guides/developer/protect/application/create_app/) that can be used to populate below parameters.

```
const authConfig = {
   domain: 'your-domain', // e.g. 'example.demo.cloudentity.com.' Recommended; always generates URLs with 'https' protocol.
    // baseUrl: optional alternative to 'domain.' Protocol required, e.g. 'https://example.demo.cloudentity.com.'
    // In situations where protocol may dynamically resolve to 'http' rather than 'https' (for example in dev mode), use 'baseUrl' rather than 'domain'.
    tenantId: 'your-tenant-id',
    authorizationServerId: 'your-authorization-server-id',
    clientId: 'your-client-id',
    redirectUri: 'window.location.href',
    silentAuthRedirectUri: 'window.location.href' + '/silent', // optional setting to redirect to a different endpoint following successful silent auth flow
    userInfoUri: 'your-user-info-uri', // optional, for fetching user info via API
    scopes: ['profile', 'email', 'openid', 'revoke_tokens'], // 'revoke_tokens' scope must be present for 'logout' action to revoke token! Without it, token will only be deleted from browser's local storage.
    accessTokenName: 'your_org_access_token', // optional; defaults to '{tenantId}_{authorizationServerId}_access_token'
    idTokenName: 'your_org_access_token', // optional; defaults to '{tenantId}_{authorizationServerId}_id_token'

};
```

### Run the app

`yarn start`
