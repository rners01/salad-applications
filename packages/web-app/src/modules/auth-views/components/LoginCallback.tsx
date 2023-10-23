import { LoadingSpinner } from '@saladtechnologies/garden-components'
import type { FC } from 'react'
import { useEffect, useState } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Redirect } from 'react-router'
import { useAuthService } from '../../auth/useAuthService'

const styles = () => ({
  container: {
    textAlign: 'center',
    width: '100%',
    paddingTop: '10rem',
  },
})

interface Props extends WithStyles<typeof styles> {}

export const _LoginCallback: FC<Props> = ({ classes }) => {
  const { getIsAuthenticated, completeSignIn } = useAuthService()
  const [isSigninCompleted, setIsSigninCompleted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    const handleCompleteSignIn = async () => {
      let googleAuthCode = new URLSearchParams(window.location.search).get('code')
      if (googleAuthCode) {
        await completeSignIn(window.location.href)
        setIsSigninCompleted(true)
      }
    }

    const handleGetUser = async () => {
      const isUserAuthenticated = await getIsAuthenticated()

      setIsAuthenticated(isUserAuthenticated)
    }

    handleGetUser()
    handleCompleteSignIn()
  }, [getIsAuthenticated, completeSignIn])

  return isSigninCompleted || isAuthenticated ? (
    <Redirect exact from="/login-callback" to="/login" />
  ) : (
    <div className={classes.container}>
      <LoadingSpinner variant="light" size={50} />
    </div>
  )
}

export const LoginCallback = withStyles(styles)(_LoginCallback)
