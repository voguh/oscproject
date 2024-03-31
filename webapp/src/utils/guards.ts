export function channelSubscribeGuard(data: SEBaseEvent): data is SESubscribeEvent {
  return data.type === 'subscriber'
}

export function channelSubGiftGuard(data: SEBaseEvent): data is SESubGiftEvent {
  return data.type === 'communityGiftPurchase'
}

export function channelCheerGuard(data: SEBaseEvent): data is SECheerEvent {
  return data.type === 'cheer'
}

export function channelTipGuard(data: SEBaseEvent): data is SETipEvent {
  return data.type === 'tip'
}
