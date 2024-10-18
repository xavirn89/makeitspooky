// @/components/room/Players.tsx
"use client"

import { Player } from '@/types/global'

interface PlayersProps {
  players: Player[]
  username: string
  host: string | null
}

const Players = ({ players, username, host }: PlayersProps) => {
  return (
    <div className='flex-col w-full space-y-4'>
      <h2 className="text-xl font-semibold">Players in the room:</h2>
      <ul className="bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
        {players.map((player, index) => (
          <li key={index} className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span>{player.username}</span>
              {player.username === host && (
                <span className="text-xs text-yellow-500 bg-gray-700 py-1 px-2 rounded-full">Host</span>
              )}
            </div>
            <span className={`px-2 py-1 rounded-lg ${player.ready ? 'bg-green-500' : 'bg-red-500'}`}>
              {player.ready ? 'Ready' : 'Not Ready'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Players
