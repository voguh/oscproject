/* eslint-disable prettier/prettier */
declare interface SESocketEventConnected {
  type: 'socket_connected'
  data: unknown
}

declare interface SESocketEventDisconnected {
  type: 'socket_disconnected'
  data: unknown
}

declare interface SESocketEventAuthenticated {
  type: 'socket_authorized'
  data: {
    clientId: string
    channelId: string
    project: string
    message: string
  }
}

declare interface SESocketEventUnauthorized {
  type: 'socket_unauthorized'
  data: {
    message: string
  }
}

/* ============================================================================================== */

declare interface SEBaseEvent<Type = string, Data = Record<string, any>> {
  _id: string
  activityId: string
  channel: string
  provider: string
  type: Type
  isMock: boolean
  sessionEventsCount: number
  createdAt: string
  updatedAt: string
  data: Data
}

declare type SEFollowerEvent = SEBaseEvent<'follow', {
  providerId: string
  username: string
  avatar: string
  quantity: number
}>

declare type SESubscribeEvent = SEBaseEvent<'subscriber', {
  providerId: string
  username: string
  avatar: string
  tier: 'prime' | '1000' | '2000' | '3000'
  amount: number
  gifted: boolean
  message?: string
  sender?: string
}>

/** First you will receive this event, then 'subscriber' event */
declare type SESubGiftEvent = SEBaseEvent<'communityGiftPurchase', {
  providerId: string
  username: string
  avatar: string
  amount: number
}>

declare type SECheerEvent = SEBaseEvent<'cheer', {
  providerId: string
  username: string
  avatar: string
  amount: number
  message: string
}>

declare type SETipEvent = SEBaseEvent<'tip', {
  providerId?: string
  username: string
  avatar?: string
  amount: number
  message: string
}>

declare interface SESocketEventMessage {
  type: 'event_message'
  data: SEBaseEvent
}

/* ============================================================================================== */

declare type SESocketEvent = SESocketEventConnected | SESocketEventDisconnected | SESocketEventAuthenticated | SESocketEventUnauthorized | SESocketEventMessage