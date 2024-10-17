// @/components/JoinRoom
"use client"

import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { useRouter } from 'next/navigation'
import { ref, get } from 'firebase/database'
import { database } from '@/firebase'

const JoinRoom = () => {
  const [roomTokenInput, setRoomTokenInput] = useState<string>('')
  const { setRoomToken } = useAppStore()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleJoinRoom = async () => {
    if (roomTokenInput.trim()) {
      const roomRef = ref(database, `rooms/${roomTokenInput}`)
      const roomSnapshot = await get(roomRef)

      if (roomSnapshot.exists()) {
        // La sala existe, podemos unirnos
        setRoomToken(roomTokenInput)
        router.push(`/room`)
      } else {
        // La sala no existe
        setError('Room does not exist. Please check the token and try again.')
      }
    } else {
      setError('Please enter a valid room token!')
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      <input
        type="text"
        value={roomTokenInput}
        placeholder="Enter room token to join"
        className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => {
          setRoomTokenInput(e.target.value)
          setError(null) // Limpiar cualquier error previo al modificar el input
        }}
      />
      <button
        onClick={handleJoinRoom}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
      >
        Join Room
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

export default JoinRoom
