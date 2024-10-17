// @/utils/firebaseUtils.ts

import { ref, onValue, set, push, update, get } from 'firebase/database'
import { database } from '@/firebase'
import { ChatMessage, Player } from '@/types/global'

// Agregar un jugador a la sala
export const addPlayerToRoom_DB = (roomToken: string, username: string) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return set(playerRef, { username, ready: false })
}

// Establecer la etapa y la ronda de la sala
export const setStageAndRoundAndPhase_DB = (roomToken: string, stage: number, round: number, phase: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { stage, round, phase })
}

// Establecer la etapa de la sala
export const setStage_DB = (roomToken: string, stage: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { stage })
}

// Establecer la ronda de la sala
export const setRound_DB = (roomToken: string, round: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { round })
}

// Establecer la fase de la ronda
export const setPhase_DB = (roomToken: string, phase: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { phase })
}

// Obtener el host de la sala
export const getRoomHost_DB = async (roomToken: string): Promise<string | null> => {
  try {
    const hostRef = ref(database, `rooms/${roomToken}/host`)
    const snapshot = await get(hostRef)
    return snapshot.exists() ? snapshot.val() : null
  } catch (error) {
    console.error("Error fetching host data:", error)
    throw new Error("Failed to fetch host data")
  }
}

// Escuchar los cambios en el stage de la sala
export const listenToStage_DB = (roomToken: string, callback: (stage: number) => void) => {
  const stageRef = ref(database, `rooms/${roomToken}/stage`)
  return onValue(stageRef, (snapshot) => {
    const stage = snapshot.val()
    callback(stage)
  })
}

// Cambiar el estado "Ready" del jugador
export const setPlayerReady_DB = (roomToken: string, username: string, ready: boolean) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return update(playerRef, { ready })
}

// Escuchar los cambios en la lista de jugadores
export const listenToPlayers_DB = (roomToken: string, callback: (players: Player[]) => void) => {
  const playersRef = ref(database, `rooms/${roomToken}/players`)
  return onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val() || {}
    const playersList = Object.values(playersData) as Player[]
    callback(playersList)
  })
}

// Enviar un mensaje al chat
export const sendMessage_DB = (roomToken: string, username: string, message: string) => {
  const newMessageRef = push(ref(database, `rooms/${roomToken}/chat`))
  return set(newMessageRef, {
    username,
    message,
    timestamp: Date.now()
  })
}

// Escuchar los mensajes del chat
export const listenToMessages_DB = (roomToken: string, callback: (messages: ChatMessage[]) => void) => {
  const chatRef = ref(database, `rooms/${roomToken}/chat`)
  return onValue(chatRef, (snapshot) => {
    const chatData = snapshot.val() || {}
    // Convertir el objeto de mensajes en una lista ordenada por timestamp
    const messagesList = (Object.values(chatData) as ChatMessage[]).sort((a, b) => a.timestamp - b.timestamp)
    callback(messagesList)
  })
}

// Save the player's transformed URL under the current round
export const savePlayerUrl_DB = (roomToken: string, round: number, username: string, url: string) => {
  const urlRef = ref(database, `rooms/${roomToken}/urls/${round}/${username}`)
  return set(urlRef, { url: url })
}

// Escuchar los cambios en las URLs subidas por los jugadores
export const listenToPlayerUrls_DB = (roomToken: string, round: number, callback: (urls: { [username: string]: string }) => void) => {
  const urlsRef = ref(database, `rooms/${roomToken}/urls/${round}`)
  return onValue(urlsRef, (snapshot) => {
    const urlsData = snapshot.val() || {}
    callback(urlsData)
  })
}

// Borrar la sala de Firebase
export const deleteRoom_DB = async (roomToken: string) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return set(roomRef, null)
}

// Guardar el voto del jugador
export const saveVote_DB = (roomToken: string, round: number, voter: string, votedPlayer: string) => {
  const voteRef = ref(database, `rooms/${roomToken}/votes/${round}/${voter}`)
  return set(voteRef, votedPlayer)
}

// Guardar los puntos del jugador
export const savePlayerPoints_DB = async (roomToken: string, player: string, points: number) => {
  const pointsRef = ref(database, `rooms/${roomToken}/points/${player}`)
  const snapshot = await get(pointsRef)
  const currentPoints = snapshot.exists() ? snapshot.val() : 0
  return set(pointsRef, currentPoints + points)
}

// Escuchar los cambios en los votos de los jugadores
export const listenToVotes_DB = (roomToken: string, round: number, callback: (votes: { [voter: string]: string }) => void) => {
  const votesRef = ref(database, `rooms/${roomToken}/votes/${round}`)
  return onValue(votesRef, (snapshot) => {
    const votesData = snapshot.val() || {}
    callback(votesData)
  })
}

// Guardar el número de rondas en la base de datos
export const setNumberOfRounds_DB = (roomToken: string, numRounds: number) => {
  const roundsRef = ref(database, `rooms/${roomToken}/numRounds`)
  return set(roundsRef, numRounds)
}

// Escuchar cambios en el round
export const listenToRound_DB = (roomToken: string, callback: (round: number) => void) => {
  const roundRef = ref(database, `rooms/${roomToken}/round`)
  return onValue(roundRef, (snapshot) => {
    const round = snapshot.val()
    callback(round)
  })
}

// Obtener el número de rondas
export const getNumRounds_DB = async (roomToken: string): Promise<number | null> => {
  const numRoundsRef = ref(database, `rooms/${roomToken}/numRounds`)
  const snapshot = await get(numRoundsRef)
  return snapshot.exists() ? snapshot.val() : null
}

// Obtener los puntos de los jugadores
export const getPlayerPoints_DB = async (roomToken: string): Promise<{ [username: string]: number }> => {
  const pointsRef = ref(database, `rooms/${roomToken}/points`)
  const snapshot = await get(pointsRef)
  return snapshot.val() || {}
}
