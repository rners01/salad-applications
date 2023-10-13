import type { User } from 'oidc-client-ts'
import { UserManager } from 'oidc-client-ts'
import { useEffect } from 'react'
import { googleAuthConfig } from './utils/auth.google.config'

export interface AuthServiceProps {
  getUser(): Promise<User | null>
  login(): Promise<void>
  logout(): Promise<void>
  signinCallback(): Promise<User>
}

export const useAuthService = (): AuthServiceProps => {
  // const oidcSettings = {
  //   authority: 'https://...',
  //   client_id: 'myClientId',
  //   client_secret: 'mySecret',
  //   redirect_uri: 'http://...',
  //   response_type: 'code',
  //   scope: 'otherScope profile openid email',
  //   loadUserInfo: true,
  //   userStore: new WebStorageStateStore({ store: window.localStorage }),
  //   metadata: {
  //     authorization_endpoint:
  //       'https://...',
  //     issuer: 'https://...',
  //     token_endpoint: 'https://...',
  //     userinfo_endpoint: 'https://...',
  //   },
  // }

  const userManager = new UserManager(googleAuthConfig)

  const getUser = (): Promise<User | null> => {
    return userManager.getUser()
  }

  const login = (): Promise<void> => {
    return userManager.signinRedirect()
  }

  const logout = (): Promise<void> => {
    return userManager.signoutRedirect()
  }

  const signinCallback = (): Promise<User> => {
    return userManager.signinRedirectCallback()
  }

  useEffect(() => {
    getUser().then((user) => {
      console.log('userInfo via AuthService.getUSer() : ', user) // null
    })
  }, [])

  return {
    getUser,
    login,
    logout,
    signinCallback,
  }
}
