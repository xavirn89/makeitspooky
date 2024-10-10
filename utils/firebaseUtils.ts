// @/utils/firebaseUtils.ts

import { ref, onValue, set, push } from 'firebase/database'
import { database } from '@/firebase'
import { ChatMessage, Player } from '@/types/global'

// Agregar un jugador a la sala
export const addPlayerToRoom = (roomToken: string, username: string) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return set(playerRef, { username })
}

// Escuchar los cambios en la lista de jugadores
export const listenToPlayers = (roomToken: string, callback: (players: Player[]) => void) => {
  const playersRef = ref(database, `rooms/${roomToken}/players`)
  return onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val() || {}
    // Convertir el objeto de jugadores en una lista de objetos { username: string }
    const playersList = Object.values(playersData) as Player[]
    callback(playersList)
  })
}

// Enviar un mensaje al chat
export const sendMessage = (roomToken: string, username: string, message: string) => {
  const newMessageRef = push(ref(database, `rooms/${roomToken}/chat`))
  return set(newMessageRef, {
    username,
    message,
    timestamp: Date.now()
  })
}

// Escuchar los mensajes del chat
export const listenToMessages = (roomToken: string, callback: (messages: ChatMessage[]) => void) => {
  const chatRef = ref(database, `rooms/${roomToken}/chat`)
  return onValue(chatRef, (snapshot) => {
    const chatData = snapshot.val() || {}
    // Convertir el objeto de mensajes en una lista ordenada por timestamp
    const messagesList = (Object.values(chatData) as ChatMessage[]).sort((a, b) => a.timestamp - b.timestamp)
    callback(messagesList)
  })
}
