export class FriendRequestEvent {
  name = 'notification:friend_request'
  constructor(public readonly friendOfId: number) {}
}

export class FriendRequestAccepted {
  name = 'notification:friend_accepted'
  constructor(public readonly friendOfId: number) {}
}
