import { ref, onValue, set, push } from 'firebase/database'
import { database } from '@/firebase'

// Agregar un jugador a la sala
export const addPlayerToRoom = (roomToken: string, username: string) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return set(playerRef, username)
}

// Escuchar los cambios en la lista de jugadores
export const listenToPlayers = (roomToken: string, callback: (players: string[]) => void) => {
  const playersRef = ref(database, `rooms/${roomToken}/players`)
  return onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val() || []
    callback(Object.values(playersData))
  })
}

// Enviar un mensaje al chat
export const sendMessage = (roomToken: string, username: string, message: string) => {
  const newMessageRef = push(ref(database, `rooms/${roomToken}/chat`))
  return set(newMessageRef, { username, message })
}

// Escuchar los mensajes del chat
export const listenToMessages = (roomToken: string, callback: (messages: any) => void) => {
  const chatRef = ref(database, `rooms/${roomToken}/chat`)
  return onValue(chatRef, (snapshot) => {
    const chatData = snapshot.val() || []
    callback(Object.values(chatData))
  })
}
