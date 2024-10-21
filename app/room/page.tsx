// @/app/room/page.tsx
"use client"

import { useRouter } from 'next/navigation'
import { setPlayerReady_DB, setStageAndRoundAndPhase_DB, setNumberOfRounds_DB } from '@/utils/firebaseUtils'
import { useAppStore } from '@/stores/useAppStore'
import RoomTitle from '@/components/room/RoomTitle'
import Players from '@/components/room/Players'
import Chat from '@/components/room/Chat'
import Navbar from '@/sections/Navbar'
import Controls from '@/components/room/Controls'
import RoomInfo from '@/components/room/RoomInfo'
import { useRoomLogic } from '@/hooks/useRoomLogic'

const RoomPage = () => {
  const { roomToken, username, setStage, setRound, setPhase } = useAppStore()
  const {
    imHost,
    hostName,
    players,
    allReady,
    numRounds,
    setNumRounds,
  } = useRoomLogic()
  const router = useRouter()

  const toggleReady = () => {
    const currentPlayer = players.find((p) => p.username === username)
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
    if (players.length < 3) {
      alert("At least 3 players are required to start the game.")
      return
    }
    
    await setNumberOfRounds_DB(roomToken!, numRounds)
    await setStageAndRoundAndPhase_DB(roomToken!, 1, 1, 0)
    setStage(1)
    setRound(1)
    setPhase(0)
    router.push('/game')
  }

  if (!roomToken || !username) return null

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col items-center">
      <Navbar roomToken={roomToken} closeButton />

      <div className="flex w-full h-full max-w-6xl gap-10">
        <div className="flex flex-col w-2/3 h-full gap-10">
          <RoomTitle roomToken={roomToken} />
          <Chat />
        </div>

        <div className="flex flex-col w-1/3 h-full gap-10">
          <RoomInfo
            imHost={imHost || false}
            numRounds={numRounds}
            handleNumRoundsChange={handleNumRoundsChange}
          />
          <Players players={players} username={username} host={hostName} />
          <Controls
            isReady={players.find((p) => p.username === username)?.ready || false}
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