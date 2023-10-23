import type { Location } from 'history'
import type { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch, withRouter } from 'react-router'
import { NotFoundPage } from './NotFoundPage'
import { ReferralOnboardingContainer, ReferralWelcomeContainer } from './modules/account-views/referral-views'
import { LoginPageContainer } from './modules/auth-views'
import { LoginCallback } from './modules/auth-views/components/LoginCallback'
import { LogoutCallback } from './modules/auth-views/components/LogoutCallback'
import { ReplaceBonusModalContainer } from './modules/bonus-views'
import { EarningSummaryContainer } from './modules/earn-views/EarningSummaryContainer'
import { RewardDetailsContainer, SelectTargetRewardContainer } from './modules/reward-views'
import { SaladPayOrderSummaryContainer } from './modules/salad-pay-views'
import { SettingsContainer } from './modules/settings-views'
import { StorefrontHomePage } from './modules/storefront-views/pages/StorefrontHomePage'
import { VaultListContainer } from './modules/vault-views'

const _Routes = ({ location }: RouteComponentProps) => {
  const currentLocation =
    (location.state as { currentLocation: Location | undefined } | undefined)?.currentLocation || location

  return (
    <Switch location={currentLocation}>
      {/* Login Pages */}
      <Route path="/login-callback" exact render={() => <LoginCallback />} />
      <Route path="/logout-callback" exact render={() => <LogoutCallback />} />
      <Route path="/login" exact component={LoginPageContainer} />

      {/* Onboarding */}
      <Route exact path="/onboarding/referral" component={ReferralOnboardingContainer} />
      <Route exact path="/onboarding/welcome" component={ReferralWelcomeContainer} />
      <Redirect exact from="/welcome" to="/onboarding/welcome" />

      {/* Store Pages */}
      <Route path={['/store', '/store/search']} exact render={() => <StorefrontHomePage />} />
      <Route path="/store/rewards/:id" exact component={RewardDetailsContainer} />
      <Route path="/store/vault" exact component={VaultListContainer} />
      {/* Recommended Target Rewards Page */}
      <Route path="/store/select-target-reward" exact component={SelectTargetRewardContainer} />

      {/* Modals */}
      {/* SaladPay: This is stand in until we figure out iFrames, popups... */}
      <Route exact path="/salad-pay/order-summary" component={SaladPayOrderSummaryContainer} />
      <Route exact path="/bonuses/replace-bonus" component={ReplaceBonusModalContainer} />

      {/* Account */}
      <Redirect exact from="/account" to="/account/summary" />
      <Route path="/account" component={SettingsContainer} />

      <Redirect exact from="/earn" to="/earn/summary" />
      <Route path="/earn" component={EarningSummaryContainer} />

      <Route
        exact
        path="/search"
        component={({ location }: RouteComponentProps) => (
          <Redirect
            to={{
              ...location,
              pathname: `/store${location.pathname}`,
            }}
          />
        )}
      />
      <Redirect exact from="/rewards/:id" to="/store/rewards/:id" />
      <Redirect exact from="/" to="/store" />

      <Route component={NotFoundPage} />
    </Switch>
  )
}

export const Routes = withRouter(_Routes)
