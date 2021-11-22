const authConfig = {
  domain: 'ACP_INSTANCE_DOMAIN',
  tenantId: 'ACP_INSTANCE_TENANT_ID',
  authorizationServerId: 'ACP_INSTANCE_AUTH_SEVER_ID',
  clientId: 'REPLACE_WITH_A_CLIENT_ID',
  redirectUri: 'http://localhost:3000/dashboard',
  scopes: ['profile'],
  letClientSetAccessToken: false,
  accessTokenName: 'ins_demo_access_token',
  idTokenName: 'ins_demo_id_token'
};

export default authConfig;