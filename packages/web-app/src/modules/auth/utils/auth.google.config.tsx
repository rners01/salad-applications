// This api will come in the next version

import type { UserManagerSettings } from 'oidc-client-ts'
import { WebStorageStateStore } from 'oidc-client-ts'

export const googleAuthConfig: UserManagerSettings = {
  // Url of the Identity Provider
  authority: 'https://accounts.google.com',

  // URL of the SPA to redirect the user to after login
  redirect_uri: 'http://localhost:3000/login-callback',
  post_logout_redirect_uri: 'http://localhost:3000/logout-callback',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  client_id: 'some_id',
  // client_secret: '...',
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  response_type: 'code',
  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  scope: 'openid profile email',
  metadata: {
    end_session_endpoint: 'http://localhost:3000/logout-callback',
  },
}
