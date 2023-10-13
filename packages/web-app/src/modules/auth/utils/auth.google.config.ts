// This api will come in the next version

import type { UserManagerSettings } from 'oidc-client-ts'

export const googleAuthConfig: UserManagerSettings = {
  // Url of the Identity Provider
  authority: 'https://accounts.google.com',

  // URL of the SPA to redirect the user to after login
  redirect_uri: window.location.origin,

  // The SPA's id. The SPA is registerd with this id at the auth-server
  client_id: '1037779195227-cqbq8d0arfvb57kqplvb0roi4v8hq7mv.apps.googleusercontent.com',
  client_secret: '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',
  loadUserInfo: true,

  // set the scope for the permissions the client should request
  // The first three are defined by OIDC. The 4th is a usecase-specific one
  // scope: 'openid profile email',
}
