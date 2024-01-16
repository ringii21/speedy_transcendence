/**
 * sync with front/src/types/Events.ts
 */
export enum ChatSocketEvent {
  MESSAGE = 'message',
  JOIN_CHANNEL = 'join_channel',
  LEAVE_CHANNEL = 'leave_channel',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  SUBSCRIBE_CHANNEL = 'subscribe_channel',
  UNSUBSCRIBE_CHANNEL = 'unsubscribe_channel',
}
