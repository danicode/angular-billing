// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const base_uris = {
  auth_server: {
    domain: 'http://localhost:9000/',
    endpoints: {
      authorize: 'oauth2/authorize?',
      token: 'oauth2/token',
      logout: 'logout'
    }
  },
  resource_server: {
    domain: 'http://localhost:8080/',
    endpoints: {
      resource: 'resource/',
      client: 'api/clientes',
      region: '/regiones',
      page: '/page/',
      upload: '/upload',
      img: 'api/uploads/img/'
    }
  },
  client: {
    domain: 'http://localhost:4200/',
    endpoints: {
      authorized: 'authorized',
    }
  }
}

export const environment = {
  production: false,
  
  client_id : 'client',
  //redirect_uri: 'http://localhost:4200/authorized',
  redirect_uri: base_uris.client.domain + base_uris.client.endpoints.authorized,
  //scope: 'openid profile',
  scope: 'openid',
  response_type: 'code',
  response_mode: 'form_post',
  code_challenge_method: 'S256',
  grant_type: 'authorization_code',
  secret_pkce: 'secret',
  //resource_url: 'http://localhost:8080/resource/',
  resource_url: base_uris.resource_server.domain + base_uris.resource_server.endpoints.resource,
  //token_url: 'http://localhost:9000/oauth2/token',
  token_url: base_uris.auth_server.domain + base_uris.auth_server.endpoints.token,
  //logout_url: 'http://localhost:9000/logout',
  logout_url: base_uris.auth_server.domain + base_uris.auth_server.endpoints.logout,
  //authorize_uri: 'http://localhost:9000/oauth2/authorize?',
  authorize_uri: base_uris.auth_server.domain + base_uris.auth_server.endpoints.authorize,
  //http://localhost:8080/api/clientes
  client_url: base_uris.resource_server.domain + base_uris.resource_server.endpoints.client,
  //http://localhost:8080/api/clientes/regiones
  region_url: base_uris.resource_server.domain + base_uris.resource_server.endpoints.client + base_uris.resource_server.endpoints.region,
  //http://localhost:8080/api/clientes/page/
  client_page_url: base_uris.resource_server.domain + base_uris.resource_server.endpoints.client + base_uris.resource_server.endpoints.page,
  //http://localhost:8080/api/clientes/upload
  client_upload_url: base_uris.resource_server.domain + base_uris.resource_server.endpoints.client + base_uris.resource_server.endpoints.upload,
  //http://localhost:8080/api/uploads/img/
  client_img_url: base_uris.resource_server.domain + base_uris.resource_server.endpoints.img,
  roles: {
    admin: 'ROLE_ADMIN',
    user: 'ROLE_USER'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
