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
    <div className='flex flex-col'>
      <h2 className="text-2xl font-semibold mb-2">Players</h2>
      <div className="h-64 bg-gray-800 p-4 rounded-lg shadow-md overflow-y-auto">
        {players.length === 0 ? (
          <p className="text-gray-400">No players yet</p>
        ) : (
          <ul className="space-y-2">
            {players.map((player, index) => (
              <li key={index} className="flex justify-between items-center py-2 px-4 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className={`font-semibold ${player.username === username ? 'text-indigo-400' : 'text-white'}`}>
                    {player.username}
                  </span>
                  {player.username === host && (
                    <span className="text-xs text-yellow-500 bg-gray-600 py-1 px-2 rounded-full">Host</span>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${player.ready ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {player.ready ? 'Ready' : 'Not Ready'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Players
