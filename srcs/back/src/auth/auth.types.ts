export interface IMe {
  email: string
  login: string
  access_token: string
  refresh_token: string
  expires_in: number
  image: {
    link: string
    versions: {
      large: string
      medium: string
      small: string
      micro: string
    }
  }
}
