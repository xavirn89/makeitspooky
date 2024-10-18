"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addPlayerToRoom_DB, listenToPlayers_DB, sendMessage_DB, listenToMessages_DB, setPlayerReady_DB, setStageAndRoundAndPhase_DB, getRoomHost_DB, listenToStage_DB, setNumberOfRounds_DB } from '@/utils/firebaseUtils'
import { useAppStore } from '@/stores/useAppStore'
import { Player, ChatMessage } from '@/types/global'
import RoomTitle from '@/components/room/RoomTitle'
import Players from '@/components/room/Players'
import ControlsAndInfo from '@/components/room/ControlsAndInfo'

import { listenToNumRounds_DB } from '@/utils/firebaseUtils'
import Chat from '@/components/room/Chat'

const RoomPage = () => {
  const { roomToken, username, setStage, setRound, setPhase } = useAppStore()
  const [imHost, setImHost] = useState<boolean | undefined>()
  const [hostName, setHostName] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [chat, setChat] = useState<ChatMessage[]>([])
  const [allReady, setAllReady] = useState<boolean>(false)
  const [numRounds, setNumRounds] = useState<number>(3)
  const router = useRouter()

  useEffect(() => {
    if (!roomToken) {
      router.push('/')
      return
    }

    if (!username) return

    addPlayerToRoom_DB(roomToken, username)

    const unsubscribePlayers = listenToPlayers_DB(roomToken, (players: Player[]) => {
      setPlayers(players)
      setAllReady(players.every(player => player.ready))
    })

    

    // Escuchar el número de rondas
    const unsubscribeNumRounds = listenToNumRounds_DB(roomToken, (newNumRounds) => {
      if (numRounds !== newNumRounds) {
        setNumRounds(newNumRounds)
      }
    })

    if (!imHost) {
      const unsubscribeStage = listenToStage_DB(roomToken, (newStage: number) => {
        if (newStage === 1) {
          router.push('/game')
          setStage(1)
          setRound(1)
          setPhase(0)
        }
      })

      return () => {
        unsubscribeStage()
      }
    }

    return () => {
      unsubscribePlayers()
      unsubscribeNumRounds()
    }
  }, [roomToken, username, router, imHost])

  // Obtener el host de la sala
  useEffect(() => {
    if (!roomToken) return

    const handleGetRoomHost = async () => {
      const hostName = await getRoomHost_DB(roomToken)
      setImHost(username === hostName)
      setHostName(hostName)
    }

    if (roomToken && imHost === undefined) handleGetRoomHost()
  }, [roomToken, imHost, username])

  const toggleReady = () => {
    const currentPlayer = players.find(p => p.username === username)
    if (currentPlayer) {
      setPlayerReady_DB(roomToken!, username!, !currentPlayer.ready)
    }
  }

  const handleNumRoundsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setNumRounds(value)
    setTimeout(async () => {
      await setNumberOfRounds_DB(roomToken!, value)
    }, 100)
  }

  const startGame = async () => {
    await setNumberOfRounds_DB(roomToken!, numRounds)
    await setStageAndRoundAndPhase_DB(roomToken!, 1, 1, 0)
    setStage(1)
    setRound(1)
    setPhase(0)
    router.push(`/game`)
  }

  if (!roomToken || !username) return null

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center space-y-6">
      <RoomTitle roomToken={roomToken} />

      <Players players={players} username={username} host={hostName} />

      <ControlsAndInfo
        numRounds={numRounds}
        allReady={allReady}
        handleNumRoundsChange={handleNumRoundsChange}
        startGame={startGame}
        imHost={imHost || false}
        isReady={players.find(p => p.username === username)?.ready || false}
        toggleReady={toggleReady}
      />

      <Chat />
    </div>
  )
}

export default RoomPage
