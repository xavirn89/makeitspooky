"use client"

import { useAppStore } from '@/stores/useAppStore'
import Phase0 from '@/components/game/Phase0'
import Phase1 from '@/components/game/Phase1'
import RoundInfo from '@/components/game/RoundInfo'
import Classification from '@/components/game/Classification'
import Chat from '@/components/room/Chat'
import Navbar from '@/sections/Navbar'
import { useGameLogic } from '@/hooks/useGameLogic'

export default function GamePage() {
  const { round, phase, numRounds, roomToken } = useAppStore()
  const { players, playerParameters, points, imHost, roundImage } = useGameLogic()

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col flex-grow items-center">
      <Navbar roomToken={roomToken!} showRoomTitle closeButton />

      <div className='flex w-full h-full gap-10 px-52'>
        <div className='flex flex-col w-3/12 h-full gap-6'>
          <RoundInfo round={round} numRounds={numRounds} />
          <Classification points={points} players={players} />
          <Chat />
        </div>

        <div className='flex flex-col w-9/12 h-full gap-10'>
          {phase === 0 && <Phase0 />}
          {phase === 1 && <Phase1 uploadedParameters={playerParameters} roundImage={roundImage!} imHost={imHost} />}
        </div>
      </div>
    </div>
  )
}