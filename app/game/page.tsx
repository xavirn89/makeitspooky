"use client"

import { use, useEffect, useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import Phase0 from '@/components/game/Phase0'
import Phase1 from '@/components/game/Phase1'
import { listenToPlayers_DB, setPhase_DB, listenToRound_DB, listenToStage_DB, getNumRounds_DB, listenToMessages_DB, getRoomHost_DB, getRoundImage_DB, getUsedImages_DB, setRoundImage_DB, addToUsedImages_DB, listenToRoundImage_DB, listenToPlayerParameters_DB } from '@/utils/firebaseUtils'
import CloseRoomButton from '@/components/CloseRoomButton'
import RoomTitle from '@/components/room/RoomTitle'
import RoundInfo from '@/components/game/RoundInfo'
import Classification from '@/components/game/Classification'
import Chat from '@/components/room/Chat'
import { useRouter } from 'next/navigation'
import { ChatMessage, Parameters } from '@/types/global'
import { imageNames } from '@/utils/constants'

export default function GamePage() {
  const { roomToken, stage, round, username, phase, numRounds, setPhase, setRound, setNumRounds, setStage, roundImage, setRoundImage, usedImages, setUsedImages } = useAppStore()
  const [allPlayersSubmitted, setAllPlayersSubmitted] = useState<boolean>(false)
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [playerParameters, setPlayerParameters] = useState<{ [username: string]: Parameters }>({})
  const [points, setPoints] = useState<{ [player: string]: number }>({})
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [imHost, setImHost] = useState<boolean | undefined>()
  const router = useRouter()

  useEffect(() => {
    if (!roomToken || round === undefined) return

    const unsubscribeParams = listenToPlayerParameters_DB(roomToken, round, (parameters) => {
      setPlayerParameters(parameters)
    })

    const unsubscribePlayers = listenToPlayers_DB(roomToken, (players) => {
      setPlayerCount(players.length)
    })

    const unsubscribeRound = listenToRound_DB(roomToken, (newRound) => {
      setRound(newRound)
    })

    const unsubscribeChat = listenToMessages_DB(roomToken, (messages: ChatMessage[]) => {
      setChat(messages)
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
      unsubscribeChat()
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
      setAllPlayersSubmitted(true)
      setPhase(1)
      setPhase_DB(roomToken!, 1)
    }
  }, [playerParameters, playerCount, setPhase])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <RoomTitle roomToken={roomToken!} />
      <RoundInfo round={round} numRounds={numRounds} />
      <Classification points={points} />

      {roundImage && (
        <div className="my-8 flex justify-center">
          <img
            src={`/images/${roundImage}.jpg`}
            alt={`Round image: ${roundImage}`}
            className="w-96 h-auto rounded-lg shadow-lg"
          />
        </div>
      )}


      {phase === 0 && <Phase0 />}
      {phase === 1 && <Phase1 uploadedParameters={playerParameters} roundImage={roundImage!} />}


      <Chat />

      <CloseRoomButton />
    </div>
  )
}
