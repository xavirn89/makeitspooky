// @/components/room/Controls.tsx
"use client"

interface ControlsProps {
  isReady: boolean
  toggleReady: () => void
  imHost: boolean
  allReady: boolean
  startGame: () => void
}

const Controls = ({ isReady, toggleReady, imHost, allReady, startGame }: ControlsProps) => {
  return (
    <div className="flex w-full gap-2 -mt-4">
      <button
        className={`${isReady ? 'bg-red-600' : 'bg-green-600'} hover:bg-opacity-80 text-white py-2 px-4 rounded-lg w-full`}
        onClick={toggleReady}
      >
        {isReady ? 'Unready' : 'Ready'}
      </button>

      {imHost && allReady && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full"
          onClick={startGame}
        >
          Start Game
        </button>
      )}
    </div>
  )
}

export default Controls
