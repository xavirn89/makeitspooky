export interface Player {
  username: string
  ready: boolean
}

export interface ChatMessage {
  username: string
  message: string
  timestamp: number
}

export type Parameters = {
  fromObject: string
  toObject: string
  backgroundReplacePrompt: string
}
