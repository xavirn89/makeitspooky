// @/utils/firebaseUtils.ts

import { ref, onValue, set, push, update, get } from 'firebase/database'
import { database } from '@/firebase'
import { ChatMessage, Player } from '@/types/global'

// Adds a player to the room and sets their initial ready status to false
export const addPlayerToRoom_DB = (roomToken: string, username: string) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return set(playerRef, { username, ready: false })
}

// Sets the stage, round, and phase of a room
export const setStageAndRoundAndPhase_DB = (roomToken: string, stage: number, round: number, phase: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { stage, round, phase })
}

// Updates the stage of a room
export const setStage_DB = (roomToken: string, stage: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { stage })
}

// Updates the round of a room
export const setRound_DB = (roomToken: string, round: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { round })
}

// Updates the phase of the current round
export const setPhase_DB = (roomToken: string, phase: number) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return update(roomRef, { phase })
}

// Retrieves the host of a room
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

// Listens for changes to the room stage
export const listenToStage_DB = (roomToken: string, callback: (stage: number) => void) => {
  const stageRef = ref(database, `rooms/${roomToken}/stage`)
  return onValue(stageRef, (snapshot) => {
    const stage = snapshot.val()
    callback(stage)
  })
}

// Updates the player's ready state in a room
export const setPlayerReady_DB = (roomToken: string, username: string, ready: boolean) => {
  const playerRef = ref(database, `rooms/${roomToken}/players/${username}`)
  return update(playerRef, { ready })
}

// Listens for changes to the players in the room
export const listenToPlayers_DB = (roomToken: string, callback: (players: Player[]) => void) => {
  const playersRef = ref(database, `rooms/${roomToken}/players`)
  return onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val() || {}
    const playersList = Object.values(playersData) as Player[]
    callback(playersList)
  })
}

// Sends a message to the chat
export const sendMessage_DB = (roomToken: string, username: string, message: string) => {
  const newMessageRef = push(ref(database, `rooms/${roomToken}/chat`))
  return set(newMessageRef, {
    username,
    message,
    timestamp: Date.now()
  })
}

// Listens for new messages in the chat
export const listenToMessages_DB = (roomToken: string, callback: (messages: ChatMessage[]) => void) => {
  const chatRef = ref(database, `rooms/${roomToken}/chat`)
  return onValue(chatRef, (snapshot) => {
    const chatData = snapshot.val() || {}
    const messagesList = (Object.values(chatData) as ChatMessage[]).sort((a, b) => a.timestamp - b.timestamp)
    callback(messagesList)
  })
}

// Deletes a room from Firebase
export const deleteRoom_DB = async (roomToken: string) => {
  const roomRef = ref(database, `rooms/${roomToken}`)
  return set(roomRef, null)
}

// Saves a player's vote in the current round
export const saveVote_DB = (roomToken: string, round: number, voter: string, votedPlayer: string) => {
  const voteRef = ref(database, `rooms/${roomToken}/votes/${round}/${voter}`)
  return set(voteRef, votedPlayer)
}

// Saves points for a player in the room
export const savePlayerPoints_DB = async (roomToken: string, player: string, points: number) => {
  const pointsRef = ref(database, `rooms/${roomToken}/points/${player}`)
  const snapshot = await get(pointsRef)
  const currentPoints = snapshot.exists() ? snapshot.val() : 0
  return set(pointsRef, currentPoints + points)
}

// Listens for player votes in the current round
export const listenToVotes_DB = (roomToken: string, round: number, callback: (votes: { [voter: string]: string }) => void) => {
  const votesRef = ref(database, `rooms/${roomToken}/votes/${round}`)
  return onValue(votesRef, (snapshot) => {
    const votesData = snapshot.val() || {}
    callback(votesData)
  })
}

// Sets the number of rounds in the room
export const setNumberOfRounds_DB = (roomToken: string, numRounds: number) => {
  const roundsRef = ref(database, `rooms/${roomToken}/numRounds`)
  return set(roundsRef, numRounds)
}

// Listens for changes to the current round
export const listenToRound_DB = (roomToken: string, callback: (round: number) => void) => {
  const roundRef = ref(database, `rooms/${roomToken}/round`)
  return onValue(roundRef, (snapshot) => {
    const round = snapshot.val()
    callback(round)
  })
}

// Gets the total number of rounds in a room
export const getNumRounds_DB = async (roomToken: string): Promise<number | null> => {
  const numRoundsRef = ref(database, `rooms/${roomToken}/numRounds`)
  const snapshot = await get(numRoundsRef)
  return snapshot.exists() ? snapshot.val() : null
}

// Retrieves the points of all players in the room
export const getPlayerPoints_DB = async (roomToken: string): Promise<{ [username: string]: number }> => {
  const pointsRef = ref(database, `rooms/${roomToken}/points`)
  const snapshot = await get(pointsRef)
  return snapshot.val() || {}
}

// Listens for changes in the number of rounds in a room
export const listenToNumRounds_DB = (roomToken: string, callback: (numRounds: number) => void) => {
  const numRoundsRef = ref(database, `rooms/${roomToken}/numRounds`)
  return onValue(numRoundsRef, (snapshot) => {
    const numRounds = snapshot.val() || 0
    callback(numRounds)
  })
}

// Retrieves the current round image in the room
export const getRoundImage_DB = async (roomToken: string) => {
  const roundImageRef = ref(database, `rooms/${roomToken}/roundImage`)
  const snapshot = await get(roundImageRef)
  return snapshot.exists() ? snapshot.val() : null
}

// Sets the round image for the current round in the room
export const setRoundImage_DB = (roomToken: string, image: string) => {
  const roundImageRef = ref(database, `rooms/${roomToken}/roundImage`)
  return set(roundImageRef, image)
}

// Retrieves used images in the room as an array
export const getUsedImages_DB = async (roomToken: string) => {
  const usedImagesRef = ref(database, `rooms/${roomToken}/usedImages`)
  const snapshot = await get(usedImagesRef)
  const usedImagesObj = snapshot.val() || {}
  return Object.values(usedImagesObj)
}

// Adds an image to the list of used images in the room
export const addToUsedImages_DB = (roomToken: string, image: string) => {
  const usedImagesRef = ref(database, `rooms/${roomToken}/usedImages`)
  return push(usedImagesRef, image)
}

// Listens for changes to the current round image in the room
export const listenToRoundImage_DB = (roomToken: string, callback: (roundImage: string | null) => void) => {
  const roundImageRef = ref(database, `rooms/${roomToken}/roundImage`)
  return onValue(roundImageRef, (snapshot) => {
    const roundImage = snapshot.val() || null
    callback(roundImage)
  })
}

// Saves a player's parameters for transformation in a round
export const savePlayerParameters_DB = (roomToken: string, round: number, username: string, parameters: { fromObject: string, toObject: string, backgroundReplacePrompt: string }) => {
  const paramsRef = ref(database, `rooms/${roomToken}/parameters/${round}/${username}`)
  return set(paramsRef, parameters)
}

// Listens for player transformation parameters in the current round
export const listenToPlayerParameters_DB = (roomToken: string, round: number, callback: (parameters: { [username: string]: { fromObject: string, toObject: string, backgroundReplacePrompt: string } }) => void) => {
  const paramsRef = ref(database, `rooms/${roomToken}/parameters/${round}`)
  return onValue(paramsRef, (snapshot) => {
    const parametersData = snapshot.val() || {}
    callback(parametersData)
  })
}

// Check if a room with a specific token exists
export const doesRoomExist_DB = async (roomToken: string): Promise<boolean> => {
  try {
    const roomRef = ref(database, `rooms/${roomToken}`)
    const snapshot = await get(roomRef)
    return snapshot.exists()
  } catch (error) {
    console.error("Error checking if room exists:", error)
    return false
  }
}
