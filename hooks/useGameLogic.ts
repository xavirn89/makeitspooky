// @/hooks/useGameLogic.ts

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/stores/useAppStore'
import { listenToPlayers_DB, listenToPlayerParameters_DB, listenToRound_DB, listenToStage_DB, getRoomHost_DB, listenToRoundImage_DB, getUsedImages_DB, setRoundImage_DB, addToUsedImages_DB, getNumRounds_DB, getPlayerPoints_DB } from '@/utils/firebaseUtils'
import { Parameters, Player } from '@/types/global'
import { imageNames } from '@/utils/constants'

export const useGameLogic = () => {
  const { roomToken, round, username, phase, setPhase, setRound, setStage, roundImage, setRoundImage, setUsedImages, setNumRounds } = useAppStore()
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [playerParameters, setPlayerParameters] = useState<{ [username: string]: Parameters }>({})
  const [points, setPoints] = useState<{ [player: string]: number }>({})
  const [imHost, setImHost] = useState<boolean | undefined>()
  const router = useRouter()

  // Set up various listeners (player parameters, players, round, stage, round image)
  useEffect(() => {
    if (!roomToken || round === undefined) return

    const unsubscribeParams = listenToPlayerParameters_DB(roomToken, round, (parameters) => {
      setPlayerParameters(parameters)
    })

    const unsubscribePlayers = listenToPlayers_DB(roomToken, (players: Player[]) => {
      setPlayers(players)
      setPlayerCount(players.length)
    })

    const unsubscribeRound = listenToRound_DB(roomToken, (newRound) => {
      setRound(newRound)
    })

    const unsubscribeRoundImage = listenToRoundImage_DB(roomToken, (currentRoundImage) => {
      setRoundImage(currentRoundImage)
    })

    const unsubscribeStage = listenToStage_DB(roomToken, (newStage) => {
      setStage(newStage)
      if (newStage === 2) {
        router.push('/aftergame')
      }
    })

    return () => {
      unsubscribeParams()
      unsubscribePlayers()
      unsubscribeRound()
      unsubscribeStage()
      unsubscribeRoundImage()
    }
  }, [roomToken, round])

  // Get the room host and determine if the current user is the host
  useEffect(() => {
    if (!roomToken) return

    const fetchHost = async () => {
      const hostName = await getRoomHost_DB(roomToken)
      setImHost(username === hostName)
    }

    if (roomToken && imHost === undefined) fetchHost()
  }, [roomToken, imHost, username])

  // Get the number of rounds
  useEffect(() => {
    if (!roomToken) return

    const fetchNumRounds = async () => {
      const numRounds = await getNumRounds_DB(roomToken)
      setNumRounds(numRounds || 3)
    }

    fetchNumRounds()
  }, [roomToken])

  // Select and set a new round image if the user is the host
  useEffect(() => {
    if (imHost && !roundImage && roomToken) {
      const fetchRoundImage = async () => {
        const usedImages = await getUsedImages_DB(roomToken)
        setUsedImages(usedImages as string[])

        const availableImages = imageNames.filter(image => !usedImages.includes(image))
        const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]

        await setRoundImage_DB(roomToken, randomImage)
        await addToUsedImages_DB(roomToken, randomImage)

        setRoundImage(randomImage)
      }

      fetchRoundImage()
    }
  }, [imHost, roundImage, roomToken])

  // Automatically set the phase to 1 when all players have uploaded their parameters
  useEffect(() => {
    if (Object.keys(playerParameters).length === playerCount && playerCount > 0) {
      setPhase(1)
    }
  }, [playerParameters, playerCount, setPhase])

  // Update player points whenever the round changes
  useEffect(() => {
    if (!roomToken) return

    const updatePoints = async () => {
      const newPoints = await getPlayerPoints_DB(roomToken)
      setPoints(newPoints)
    }

    updatePoints()
  }, [roomToken, round])

  return { players, playerParameters, points, playerCount, imHost, roundImage }
}
