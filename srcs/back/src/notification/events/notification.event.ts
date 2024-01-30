export class FriendRequestEvent {
  name = 'notification:friend_request'
  constructor(public readonly friendOfId: number) {}
}
