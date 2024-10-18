// @/components/game/Classification
"use client"

interface ClassificationProps {
  points: { [player: string]: number }
}

const Classification = ({ points }: ClassificationProps) => {
  const sortedPlayers = Object.entries(points).sort(([, pointsA], [, pointsB]) => pointsB - pointsA)

  return (
    <div className="mt-8">
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
