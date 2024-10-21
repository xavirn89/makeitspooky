// @/hooks/useRoomLogic.ts

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  addPlayerToRoom_DB,
  listenToPlayers_DB,
  listenToStage_DB,
  listenToNumRounds_DB,
  getRoomHost_DB,
  doesRoomExist_DB,
} from '@/utils/firebaseUtils'
import { useAppStore } from '@/stores/useAppStore'
import { Player } from '@/types/global'

export const useRoomLogic = () => {
  const { roomToken, username, setStage, setRound, setPhase } = useAppStore()
  const [imHost, setImHost] = useState<boolean | undefined>()
  const [hostName, setHostName] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [allReady, setAllReady] = useState<boolean>(false)
  const [numRounds, setNumRounds] = useState<number>(3)
  const router = useRouter()

  // Check if the room exists, add the player, and set up listeners for players and rounds.
  useEffect(() => {
    if (!roomToken || !username) {
      router.push('/')
      return
    }

    const checkRoomExists = async () => {
      const roomExists = await doesRoomExist_DB(roomToken)
      if (!roomExists) {
        router.push('/')
        return
      }

      // Add player to room if it exists
      addPlayerToRoom_DB(roomToken, username)

      // Set up listeners for players and rounds
      const unsubscribePlayers = listenToPlayers_DB(roomToken, (players: Player[]) => {
        setPlayers(players)
        setAllReady(players.every((player) => player.ready))
      })

      const unsubscribeNumRounds = listenToNumRounds_DB(roomToken, (newNumRounds) => {
        if (newNumRounds !== 0) {
          setNumRounds((prevRounds) => (prevRounds !== newNumRounds ? newNumRounds : prevRounds))
        }
      })

      // Clean up listeners
      return () => {
        unsubscribePlayers()
        unsubscribeNumRounds()
      }
    }

    checkRoomExists()
  }, [roomToken, username, router])

  // Fetch the host and determine if the current player is the host
  useEffect(() => {
    if (!roomToken || imHost !== undefined) return

    const fetchHost = async () => {
      const host = await getRoomHost_DB(roomToken)
      setImHost(username === host)
      setHostName(host)
    }

    fetchHost()
  }, [roomToken, imHost, username])

  // Set up listener for stage changes if the user is not the host
  useEffect(() => {
    if (!imHost && roomToken) {
      const unsubscribeStage = listenToStage_DB(roomToken, (newStage: number) => {
        if (newStage === 1) {
          setStage(1)
          setRound(1)
          setPhase(0)
          router.push('/game')
        }
      })

      return () => unsubscribeStage()
    }
  }, [imHost, roomToken, setStage, setRound, setPhase, router])

  return { imHost, hostName, players, allReady, numRounds, setNumRounds }
}
