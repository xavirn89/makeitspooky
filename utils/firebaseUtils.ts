// @/utils/firebaseUtils.ts

import { ref, onValue, set, push, update, get } from 'firebase/database'
import { database } from '@/firebase'
import { ChatMessage, Player } from '@/types/global'

// Agregar un jugador a la sala
export const addPlayerToRoom = (roomToken: string, username: string) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return set(playerRef, { username, ready: false })
}

// Obtener el host de la sala
export const getRoomHost = async (roomToken: string): Promise<string | null> => {
  try {
    const hostRef = ref(database, `rooms/${roomToken}/host`)
    const snapshot = await get(hostRef)
    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    console.error("Error fetching host data:", error)
    throw new Error("Failed to fetch host data")
  }
}

// Cambiar el estado "Ready" del jugador
export const setPlayerReady = (roomToken: string, username: string, ready: boolean) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return update(playerRef, { ready })
}

// Escuchar los cambios en la lista de jugadores
export const listenToPlayers = (roomToken: string, callback: (players: Player[]) => void) => {
  const playersRef = ref(database, `rooms/${roomToken}/players`)
  return onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val() || {}
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


