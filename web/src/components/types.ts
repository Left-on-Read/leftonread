export interface Avatar {
  source: string
  color: string
}

export interface IText {
  key: number
  name: string
  text: string
  length: number
  avatar: Avatar
  words?: Array<string>
}
