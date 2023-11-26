import { Request } from 'express'

export const extractJwtFromCookie = (req: Request) => {
  let token = null
  if (req && req.cookies) token = req.cookies['jwt']
  return token
}
