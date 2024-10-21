// @/components/game/RoundInfo
"use client"

interface RoundInfoProps {
  round: number
  numRounds: number
}

const RoundInfo = ({ round, numRounds }: RoundInfoProps) => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-200/20 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-white">
        Round {round} / {numRounds}
      </h2>
    </div>
  )
}

export default RoundInfo
