export enum ChatSocketEvent {
  MESSAGE = 'message',
  JOIN_CHANNEL = 'join_channel',
  LEAVE_CHANNEL = 'leave_channel',
  SENT_PRIVATE_MESSAGE = 'sent_private_message',
}

export enum FriendsSocketEvent {
  ADD_FRIEND = 'add_friend',
  REMOVE_FRIEND = 'remove_channel',
}
