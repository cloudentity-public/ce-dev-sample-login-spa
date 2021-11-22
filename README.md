## About

This is a simple react app to demonostrate authentication of users through any identity providers configured using ACP as identity hub. This app has an OAuth PKCE client to interact with ACP as OAuth authorization server and to fetch the access and idToken token in return. These tokens can be utilized to make further api calls(not in scope of this app) or new tokens can be requested based on the integration pattern.

## Usage

### To install the required packages

```yarn install```

This will pull in all required npm packages and also a Cloudentity specific npm package to handle accessTokens(setting within local storage for further usage, silent refresh etc) within the SPA.

https://www.npmjs.com/package/@cloudentity/auth

Source for Cloudentity auth js for reference: https://github.com/cloudentity/cloudentity-auth-js

### Configure the app

To configure the application to use an ACP instance, navigate to `src/config/authConfig.js` and modify the settings for authConfig to provide appropriate values 

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

### To run the app

```yarn start```
