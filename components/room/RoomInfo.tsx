// @/components/room/RoomInfo.tsx
"use client"

interface RoomInfoProps {
  numRounds: number
  handleNumRoundsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imHost: boolean
}

const RoomInfo = ({ numRounds, handleNumRoundsChange, imHost }: RoomInfoProps) => {
  return (
    <div className="flex justify-end items-center w-full gap-4">
      <label className="text-white text-lg">Number of Rounds:</label>
      {imHost ? (
        <input
          type="number"
          value={numRounds}
          onChange={handleNumRoundsChange}
          className="p-2 rounded-lg bg-gray-700 text-white w-24 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ) : (
        <span className="text-white text-lg font-semibold">{numRounds}</span>
      )}
    </div>
  )
}

export default RoomInfo
