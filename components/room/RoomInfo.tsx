// @/components/room/RoomInfo.tsx
"use client"

import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

interface RoomInfoProps {
  numRounds: number
  handleNumRoundsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  imHost: boolean
}

const RoomInfo = ({ numRounds, handleNumRoundsChange, imHost }: RoomInfoProps) => {
  const increaseRounds = () => {
    handleNumRoundsChange({ target: { value: (numRounds + 1).toString() } } as React.ChangeEvent<HTMLInputElement>)
  }

  const decreaseRounds = () => {
    if (numRounds > 1) {
      handleNumRoundsChange({ target: { value: (numRounds - 1).toString() } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // If the value is empty, set to 0
    if (value === '') {
      handleNumRoundsChange({ target: { value: '0' } } as React.ChangeEvent<HTMLInputElement>)
    } else {
      handleNumRoundsChange(e)
    }
  }

  const handleBlur = () => {
    if (isNaN(numRounds) || numRounds < 1) {
      handleNumRoundsChange({ target: { value: '0' } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="flex justify-end items-center w-full gap-4">
      <label className="text-white text-lg">Number of Rounds</label>
      {imHost ? (
        <div className="flex items-center gap-2">
          <button
            onClick={decreaseRounds}
            className="bg-red-800 text-white p-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <AiOutlineMinus />
          </button>

          <input
            type="number"
            value={numRounds}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="p-2 w-16 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
            min="0"
          />

          <button
            onClick={increaseRounds}
            className="bg-green-800 text-white p-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <AiOutlinePlus />
          </button>
        </div>
      ) : (
        <span className="text-white text-lg font-semibold">{numRounds}</span>
      )}
    </div>
  )
}

export default RoomInfo
