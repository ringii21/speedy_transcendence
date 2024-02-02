import { Injectable } from '@nestjs/common'
import { Status } from './types/Status'

@Injectable()
export class StatusService {
  private userStatus = new Map<number, Status>()
  constructor() {}

  setStatus(userId: number, status: Status) {
    this.userStatus.set(userId, status)
  }

  getStatus(userId: number) {
    return this.userStatus.get(userId)
  }

  getAllStatus() {
    return this.userStatus.entries()
  }
}
