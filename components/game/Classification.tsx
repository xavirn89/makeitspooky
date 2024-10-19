// @/components/game/Classification.tsx
"use client"

import { Player } from "@/types/global"

interface ClassificationProps {
  points: { [player: string]: number }
  players: Player[]
}

const Classification = ({ points, players }: ClassificationProps) => {
  const sortedPlayers = Object.entries(points).sort(([, pointsA], [, pointsB]) => pointsB - pointsA)
  if (sortedPlayers.length === 0) {
    const zeroPointPlayers = players
      .map(player => ({ username: player.username, points: 0 }))
      .sort((a, b) => a.username.localeCompare(b.username))

    return (
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Classification</h2>
        <ul className="bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
          {zeroPointPlayers.map((player, index) => (
            <li key={index} className="flex justify-between items-center">
              <span>{player.username}</span>
              <span>{player.points} points</span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-4">Classification</h2>
      <ul className="bg-gray-800 p-4 rounded-lg shadow-md space-y-2">
        {sortedPlayers.map(([player, points], index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{player}</span>
            <span>{points} points</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Classification
