// @/components/game/RoundInfo
"use client"

interface RoundInfoProps {
  round: number
  numRounds: number
}

const RoundInfo = ({ round, numRounds }: RoundInfoProps) => {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-semibold">Round {round} / {numRounds}</h2>
    </div>
  )
}

export default RoundInfo
