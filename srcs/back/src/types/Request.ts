import { User } from '@prisma/client'
import { Request } from 'express'
import { IMe } from 'src/auth/42/42-oauth.types'

export type RequestWithDbUser = Request & { user: User }
export type RequestWithUser = Request & { user: IMe }
