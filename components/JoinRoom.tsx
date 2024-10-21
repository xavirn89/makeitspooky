// @/components/JoinRoom
"use client"

import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { useRouter } from 'next/navigation'
import { ref, get } from 'firebase/database'
import { database } from '@/firebase'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

const JoinRoom = () => {
  const [roomTokenInput, setRoomTokenInput] = useState<string>('')
  const { setRoomToken } = useAppStore()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [showToken, setShowToken] = useState<boolean>(false)

  const handleJoinRoom = async () => {
    if (roomTokenInput.trim()) {
      const roomRef = ref(database, `rooms/${roomTokenInput}`)
      const roomSnapshot = await get(roomRef)

      if (roomSnapshot.exists()) {
        setRoomToken(roomTokenInput)
        router.push(`/room`)
      } else {
        setError('Room does not exist. Please check the token and try again.')
      }
    } else {
      setError('Please enter a valid room token!')
    }
  }

  const toggleShowToken = () => {
    setShowToken(!showToken)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="relative">
        <input
          type={showToken ? 'text' : 'password'}
          value={roomTokenInput}
          placeholder="Enter room token to join"
          className="bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          onChange={(e) => {
            setRoomTokenInput(e.target.value)
            setError(null)
          }}
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400"
          onClick={toggleShowToken}
        >
          {showToken ? (
            <AiFillEyeInvisible className="h-6 w-6" />
          ) : (
            <AiFillEye className="h-6 w-6" />
          )}
        </button>
      </div>
      <button
        onClick={handleJoinRoom}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg w-full"
      >
        <p className='font-black text-lg'>Join Room</p>
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default JoinRoom
