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

export const _LogoutCallback: FC<Props> = ({ classes }) => {
  const { completeSignOut } = useAuthService()
  const [isSignoutCompleted, setIsSignoutCompleted] = useState(false)

  useEffect(() => {
    const handleCompleteSignOut = async () => {
      let googleAuthIdTokenHint = new URLSearchParams(window.location.search).get('id_token_hint')
      if (googleAuthIdTokenHint) {
        await completeSignOut(window.location.href)
        setIsSignoutCompleted(true)
      }
    }
    handleCompleteSignOut()
  }, [completeSignOut])

  return isSignoutCompleted ? (
    <Redirect exact from="/logout-callback" to="/login" />
  ) : (
    <div className={classes.container}>
      <LoadingSpinner variant="light" size={50} />
    </div>
  )
}

export const LogoutCallback = withStyles(styles)(_LogoutCallback)
