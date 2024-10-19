// @/components/CreateRoom
"use client"

import { v4 as uuidv4 } from 'uuid'
import { useAppStore } from '@/stores/useAppStore'
import { database } from '@/firebase'
import { ref, set } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

const CreateRoom = () => {
  const { username, setRoomToken } = useAppStore()
  const router = useRouter()

  const generateRoomToken = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const allCharacters = [uppercase, lowercase, numbers]
    let token = ''

    for (let i = 0; i < 5; i++) {
      const randomSet = allCharacters[Math.floor(Math.random() * allCharacters.length)]
      const randomChar = randomSet[Math.floor(Math.random() * randomSet.length)]
      token += randomChar
    }

    return token
  }

  const createRoom = useCallback(async () => {
    if (!username) {
      alert('You must set a username first!')
      return
    }

    // const roomToken = uuidv4()
    const roomToken = generateRoomToken()

    const roomRef = ref(database, `rooms/${roomToken}`)

    await set(roomRef, {
      host: username,
      players: {
        [username]: {
          username,
          ready: true
        }
      },
      createdAt: Date.now()
    })

    setRoomToken(roomToken)

    router.push(`/room`)
  }, [username, setRoomToken, router])

  return (
    <button 
      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full"
      onClick={createRoom}
    >
      <p className='font-black text-lg'>Create Room</p>
    </button>
  )
}

export default CreateRoom
