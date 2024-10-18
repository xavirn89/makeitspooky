// @/components/room/ControlsAndInfo.tsx
"use client"

interface ControlsAndInfoProps {
  numRounds: number
  allReady: boolean
  handleNumRoundsChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  startGame: () => void
  imHost: boolean
  isReady: boolean
  toggleReady: () => void
}

const ControlsAndInfo = ({
  numRounds,
  allReady,
  handleNumRoundsChange,
  startGame,
  imHost,
  isReady,
  toggleReady
}: ControlsAndInfoProps) => {
  return (
    <div className="flex w-full space-y-4 items-center">
      <div className="flex flex-col items-center w-full">
        {imHost ? (
          <>
            <label className="text-white">Number of Rounds:</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={numRounds}
                onChange={handleNumRoundsChange}
                placeholder="Number of rounds"
                className="p-2 rounded-lg bg-gray-700 text-white"
              />
            </div>
          </>
        ) : (
          <p className="text-white">Number of Rounds: {numRounds}</p>
        )}
      </div>

      <div className="flex justify-center">
        <button
          className={`${isReady ? 'bg-red-600' : 'bg-green-600'} hover:bg-opacity-80 text-white py-2 px-4 rounded-lg`}
          onClick={toggleReady}
        >
          {isReady ? 'Unready' : 'Ready'}
        </button>
      </div>

      <div className="w-full">
        

        {imHost && allReady && (
          <div className="flex justify-center mt-4">
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded-lg"
              onClick={startGame}
            >
              All Players Ready - Start Game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ControlsAndInfo
