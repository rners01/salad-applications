import type { User, UserManagerSettings } from 'oidc-client-ts'
import { UserManager } from 'oidc-client-ts'
import { useEffect, useState } from 'react'
import { googleAuthConfig } from './utils/auth.google.config'

export interface AuthServiceProps {
  getIsAuthenticated(): Promise<boolean>
  getUser(): Promise<User | null | undefined>
  getAccessToken(): Promise<string | null | undefined>
  signIn(returnUrl: string): Promise<void | User | null>
  completeSignIn(url: string): Promise<unknown>
  signOut(): Promise<unknown>
  completeSignOut(url: string): Promise<unknown>
}

export const useAuthService = (): AuthServiceProps => {
  const [userManager, setUserManager] = useState<UserManager | null>(null)

  const getUser = async (): Promise<User | null | undefined> => {
    await ensureUserManagerInitialized()

    return userManager?.getUser()
  }

  const getAccessToken = async () => {
    await ensureUserManagerInitialized()

    const user = await userManager?.getUser()
    return user && user.access_token
  }

  const signIn = async (returnUrl: string) => {
    try {
      await ensureUserManagerInitialized()

      const silentUser = await userManager?.signinSilent({ silentRequestTimeoutInSeconds: 5 })
      console.log('silentUser: ', silentUser)

      return silentUser
    } catch (silentError) {
      // User might not be authenticated, fallback to popup authentication
      console.log('Silent authentication error: ', silentError)
      console.log('returnUrl: ', returnUrl)
      try {
        //   // if (this._popUpDisabled) {
        //   //   throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
        //   // }

        // to remove popup flow comment out next 4 lines and uncomment throw error
        const popUpUser = await userManager?.signinPopup()
        console.log('popUpUser: ', popUpUser)
        window.location.replace(returnUrl)
        return popUpUser
        // throw new Error()
      } catch (popUpError: any) {
        if (popUpError.message === 'Popup window closed') {
          // The user explicitly cancelled the login action by closing an opened popup.
          console.log('The user closed the window.')
        }
        // else if (!this._popUpDisabled) {
        //   console.log("Popup authentication error: ", popUpError)
      }
      // PopUps might be blocked by the user, fallback to redirect
      try {
        const redirectUser = await userManager?.signinRedirect({ redirectMethod: 'replace' })
        console.log('redirectUser: ', redirectUser)
        // return this.redirect()
        return redirectUser
      } catch (redirectError) {
        console.log('Redirect authentication error: ', redirectError)
      }
    }
  }

  const completeSignIn = async (url: string) => {
    try {
      await ensureUserManagerInitialized()

      if (userManager !== null) {
        const user = await userManager.signinCallback(url)
        console.log('user: ', user)
        // this.updateState(user)
        return user
      }

      return null
    } catch (error) {
      console.log('There was an error signing in: ', error)
      return error
    }
  }

  const signOut = async () => {
    try {
      await ensureUserManagerInitialized()
      if (userManager === null) {
        return null
      }
      // if (this._popUpDisabled) {
      //   throw new Error('Popup disabled. Change \'AuthorizeService.js:AuthorizeService._popupDisabled\' to false to enable it.')
      // }

      // await userManager.signoutPopup()
      throw new Error()
      // this.updateState(undefined)
      // return this.success(state)
    } catch (popupSignOutError) {
      console.log('Popup signout error: ', popupSignOutError)
      try {
        if (userManager === null) {
          return null
        }
        await userManager.signoutRedirect({ redirectMethod: 'replace' })
        // return this.redirect()
      } catch (redirectSignOutError) {
        console.log('Redirect signout error: ', redirectSignOutError)
        return redirectSignOutError
      }
    }
    return userManager.signoutRedirect()
  }

  const completeSignOut = async (url: string) => {
    try {
      await ensureUserManagerInitialized()
      if (userManager === null) {
        return null
      }

      const response: any = await userManager.signoutCallback(url)
      console.log(response)
      return response?.data
    } catch (error) {
      console.log(`There was an error trying to log out '${error}'.`)
      return error
    }
  }

  const getIsAuthenticated = async () => {
    await ensureUserManagerInitialized()

    const user = await getUser()
    return !!user
  }

  const ensureUserManagerInitialized = async () => {
    console.log('ensureUserManagerInitialized: ', userManager)
    if (userManager !== null) {
      return
    }

    const response = await fetch('https://accounts.google.com/.well-known/openid-configuration')
    if (!response.ok) {
      throw new Error(`Could not load settings`)
    }

    let { authorization_endpoint, token_endpoint, userinfo_endpoint } = await response.json()

    const config: UserManagerSettings = {
      ...googleAuthConfig,
      metadata: {
        ...googleAuthConfig.metadata,
        authorization_endpoint,
        token_endpoint,
        userinfo_endpoint,
      },
    }

    const newUserManager = new UserManager(config)

    newUserManager.events.addUserSignedOut(async () => {
      await newUserManager.removeUser()
    })

    setUserManager(newUserManager)
  }

  useEffect(() => {
    getUser().then((user) => {
      console.log('userInfo via AuthService.getUSer() : ', user) // null
    })
  }, [])

  return {
    getIsAuthenticated,
    getUser,
    signIn,
    getAccessToken,
    completeSignIn,
    signOut,
    completeSignOut,
  }
}
