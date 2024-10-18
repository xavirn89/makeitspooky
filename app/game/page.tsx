"use client"

import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import Phase0 from '@/components/game/Phase0'
import Phase1 from '@/components/game/Phase1'
import { listenToPlayers_DB, setPhase_DB, listenToRound_DB, listenToStage_DB, getNumRounds_DB, getRoomHost_DB, getUsedImages_DB, setRoundImage_DB, addToUsedImages_DB, listenToRoundImage_DB, listenToPlayerParameters_DB } from '@/utils/firebaseUtils'
import CloseRoomButton from '@/components/CloseRoomButton'
import RoundInfo from '@/components/game/RoundInfo'
import Classification from '@/components/game/Classification'
import Chat from '@/components/room/Chat'
import { useRouter } from 'next/navigation'
import { Parameters, Player } from '@/types/global'
import { imageNames } from '@/utils/constants'
import Navbar from '@/sections/Navbar'

export default function GamePage() {
  const { roomToken, round, username, phase, numRounds, setPhase, setRound, setNumRounds, setStage, roundImage, setRoundImage, setUsedImages } = useAppStore()
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [players, setPlayers] = useState<Player[]>([])
  const [playerParameters, setPlayerParameters] = useState<{ [username: string]: Parameters }>({})
  const [points] = useState<{ [player: string]: number }>({})
  const [imHost, setImHost] = useState<boolean | undefined>()
  const router = useRouter()

  useEffect(() => {
    if (!roomToken || round === undefined) return

    const unsubscribeParams = listenToPlayerParameters_DB(roomToken, round, (parameters) => {
      setPlayerParameters(parameters)
    })

    const unsubscribePlayers = listenToPlayers_DB(roomToken, (players: Player[]) => {
      setPlayers(players)
    })

    const unsubscribePlayersCount = listenToPlayers_DB(roomToken, (players) => {
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
      unsubscribePlayersCount()
      unsubscribeRound()
      unsubscribeStage()
      unsubscribeRoundImage()
    }
  }, [roomToken, round])

  // Obtener el host de la sala
  useEffect(() => {
    if (!roomToken) return

    const handleGetRoomHost = async () => {
      const hostName = await getRoomHost_DB(roomToken)
      setImHost(username === hostName)
    }

    if (roomToken && imHost === undefined) handleGetRoomHost()
  }, [roomToken, imHost, username])

  useEffect(() => {
    if (!roomToken) return

    const getNumRounds = async () => {
      const numRounds = await getNumRounds_DB(roomToken)
      setNumRounds(numRounds || 3)
    }
    getNumRounds()
  }, [roomToken])

  useEffect(() => {
    if (imHost && !roundImage) {
      const fetchRoundImage = async () => {
        if (!roundImage) {
          const usedImages = await getUsedImages_DB(roomToken!)
          setUsedImages(usedImages as string[])
  
          const availableImages = imageNames.filter(image => !usedImages.includes(image))
          const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]
  
          await setRoundImage_DB(roomToken!, randomImage)
          await addToUsedImages_DB(roomToken!, randomImage)
  
          setRoundImage(randomImage)
        }
      }
      fetchRoundImage()
    }
  }, [imHost, roundImage, roomToken])

  useEffect(() => {
    console.log("Length of playerParameters: ", Object.keys(playerParameters).length)
    console.log("Player count: ", playerCount)
    if (Object.keys(playerParameters).length === playerCount && playerCount > 0) {
      setPhase(1)
      setPhase_DB(roomToken!, 1)
    }
  }, [playerParameters, playerCount, setPhase])

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center">
      <Navbar roomToken={roomToken!} />

      <div className='flex w-full h-full gap-10 px-52'>
        <div className='flex flex-col w-3/12 h-full gap-6'>
          <RoundInfo round={round} numRounds={numRounds} />
          <Classification points={points} players={players} />
          <Chat />
        </div>

        <div className='flex flex-col w-9/12 h-full gap-10'>
          {phase === 0 && <Phase0 />}
          {phase === 1 && <Phase1 uploadedParameters={playerParameters} roundImage={roundImage!} />}
        </div>
      </div>
      <CloseRoomButton />
    </div>
  )
}
