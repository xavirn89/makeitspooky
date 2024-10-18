// @/app/room/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { addPlayerToRoom_DB, listenToPlayers_DB, setPlayerReady_DB, setStageAndRoundAndPhase_DB, getRoomHost_DB, listenToStage_DB, listenToNumRounds_DB, setNumberOfRounds_DB } from '@/utils/firebaseUtils'
import { useAppStore } from '@/stores/useAppStore'
import { Player } from '@/types/global'
import RoomTitle from '@/components/room/RoomTitle'
import Players from '@/components/room/Players'
import Chat from '@/components/room/Chat'
import Navbar from '@/sections/Navbar'
import Controls from '@/components/room/Controls'
import RoomInfo from '@/components/room/RoomInfo'

const RoomPage = () => {
  const { roomToken, username, setStage, setRound, setPhase } = useAppStore()
  const [imHost, setImHost] = useState<boolean | undefined>()
  const [hostName, setHostName] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
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

    const unsubscribeNumRounds = listenToNumRounds_DB(roomToken, (newNumRounds) => {
      setNumRounds((prevRounds) => prevRounds !== newNumRounds ? newNumRounds : prevRounds)
    })

    if (!imHost) {
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

    return () => {
      unsubscribePlayers()
      unsubscribeNumRounds()
    }
  }, [roomToken, username, router, imHost, setStage, setRound, setPhase])

  useEffect(() => {
    if (!roomToken || imHost !== undefined) return

    const fetchHost = async () => {
      const host = await getRoomHost_DB(roomToken)
      setImHost(username === host)
      setHostName(host)
    }

    fetchHost()
  }, [roomToken, imHost, username])

  const toggleReady = () => {
    const currentPlayer = players.find(p => p.username === username)
    if (currentPlayer) {
      setPlayerReady_DB(roomToken!, username!, !currentPlayer.ready)
    }
  }

  const handleNumRoundsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    setNumRounds(value)
    setTimeout(() => setNumberOfRounds_DB(roomToken!, value), 100)
  }

  const startGame = async () => {
    await setNumberOfRounds_DB(roomToken!, numRounds)
    await setStageAndRoundAndPhase_DB(roomToken!, 1, 1, 0)
    setStage(1)
    setRound(1)
    setPhase(0)
    router.push('/game')
  }

  if (!roomToken || !username) return null

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-center">
      <Navbar />

      <div className='flex w-full h-full max-w-6xl gap-10'>
        <div className='flex flex-col w-2/3 h-full gap-10'>
          <RoomTitle roomToken={roomToken} />
          <Chat />
        </div>

        <div className='flex flex-col w-1/3 h-full gap-10'>
          <RoomInfo
            imHost={imHost || false}
            numRounds={numRounds}
            handleNumRoundsChange={handleNumRoundsChange}
          />
          <Players players={players} username={username} host={hostName} />
          <Controls
            isReady={players.find(p => p.username === username)?.ready || false}
            toggleReady={toggleReady}
            imHost={imHost || false}
            allReady={allReady}
            startGame={startGame}
          />
        </div>
      </div>
    </div>
  )
}

export default RoomPage
