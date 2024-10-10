export interface Player {
  username: string
  ready: boolean
}

export interface ChatMessage {
  username: string
  message: string
  timestamp: number
}