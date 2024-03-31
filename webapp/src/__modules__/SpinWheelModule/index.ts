/* eslint-disable @typescript-eslint/no-use-before-define */
import { channelCheerGuard, channelSubscribeGuard, channelTipGuard } from '~/utils/guards'

import { SPIN_WHEEL_EXTENSION_ID, getSpinWheelConfig, updateTries } from './constants'
import { SpinWheelRender } from './SpinWheelRender'

export const spinWheelModule: OSCModule = {
  id: SPIN_WHEEL_EXTENSION_ID,
  displayName: 'Spin Wheel',
  description: 'A spin wheel extension that read bits, subs and sub gifts',
  render: SpinWheelRender,
  async onEvent(event) {
    const { allowMock, thresholds } = await getSpinWheelConfig()

    if (allowMock !== true && event.isMock) {
      return
    }

    if (channelCheerGuard(event)) {
      const data = event.data
      updateTries.push(Math.floor(data.amount / thresholds.bits))
    } else if (channelSubscribeGuard(event)) {
      const data = event.data
      if (data.tier == null) {
        data.tier = '1000'
      }

      updateTries.push(thresholds.sub[data.tier])
    } else if (channelTipGuard(event)) {
      const data = event.data
      updateTries.push(data.amount / thresholds.tip)
    }
  }
}
