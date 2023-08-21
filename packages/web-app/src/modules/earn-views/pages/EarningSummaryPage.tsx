import type { FC } from 'react'
import { useEffect } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Scrollbar } from '../../../components'
import { withLogin } from '../../auth-views'
import type { EarningWindow } from '../../balance/models'
import type { RedeemedReward } from '../../balance/models/RedeemedReward'
import type { BonusEarningRate } from '../../bonus/models'
import type { RewardVaultItem } from '../../vault/models'
import { RewardVaultStatus } from '../../vault/models'
import { EarningFrequentlyAskedQuestions, EarningHistory, EarningSummary, LatestRewardsRedeemed } from '../components'

const styles = () => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '80px',
    margin: 60,
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  lifetimeBalance?: number
  totalChoppingHours?: number
  redeemedRewards?: RewardVaultItem[]
  startRedemptionsRefresh: () => void
  stopRedemptionsRefresh: () => void
  last24Hr?: number
  last7Day?: number
  last30Day?: number
  earningHistory?: EarningWindow[]
  bonusEarningRate?: BonusEarningRate
  navigateToRewardVaultPage: () => void
}

const EarningSummaryPageRaw: FC<Props> = ({
  classes,
  currentBalance,
  lifetimeBalance,
  totalChoppingHours,
  redeemedRewards,
  last24Hr,
  last7Day,
  last30Day,
  earningHistory,
  startRedemptionsRefresh,
  stopRedemptionsRefresh,
  navigateToRewardVaultPage,
}) => {
  useEffect(() => {
    startRedemptionsRefresh()

    return () => {
      stopRedemptionsRefresh()
    }
  }, [startRedemptionsRefresh, stopRedemptionsRefresh])

  const sortByDate = (a: RedeemedReward, b: RedeemedReward): number =>
    new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1

  const latestCompletedRedeemedRewards = redeemedRewards
    ?.filter((redemption) => redemption.status === RewardVaultStatus.COMPLETE)
    .slice(-4)
    .sort(sortByDate)

  const redeemedRewardsCount = redeemedRewards?.length ?? 0

  return (
    <Scrollbar>
      <div className={classes.content}>
        <EarningSummary
          currentBalance={currentBalance}
          lifetimeBalance={lifetimeBalance}
          redeemedRewardsCount={redeemedRewardsCount}
          totalChoppingHours={totalChoppingHours}
        />
        <EarningHistory last24Hr={last24Hr} last7Day={last7Day} last30Day={last30Day} earningHistory={earningHistory} />
        <LatestRewardsRedeemed
          latestCompletedRedeemedRewards={latestCompletedRedeemedRewards}
          navigateToRewardVaultPage={navigateToRewardVaultPage}
        />
        <EarningFrequentlyAskedQuestions />
      </div>
    </Scrollbar>
  )
}

export const EarningSummaryPage = withLogin(withStyles(styles)(EarningSummaryPageRaw))
