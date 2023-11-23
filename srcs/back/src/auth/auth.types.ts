export interface IMe {
  email: string
  login: string
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
