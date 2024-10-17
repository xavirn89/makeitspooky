// @/components/CreateRoom
"use client"

import { v4 as uuidv4 } from 'uuid'
import { useAppStore } from '@/stores/useAppStore'
import { database } from '@/firebase'
import { ref, set } from 'firebase/database'
import { useRouter } from 'next/navigation'

const CreateRoom = () => {
  const { username, setRoomToken } = useAppStore()
  const router = useRouter()

  const createRoom = async () => {
    if (!username) {
      alert('You must set a username first!')
      return
    }

    const roomToken = uuidv4()

    // Crear la referencia de la sala en Firebase Realtime Database
    const roomRef = ref(database, `rooms/${roomToken}`)

    // Guardar los detalles de la sala con el host como "ready"
    await set(roomRef, {
      host: username,
      players: {
        [username]: {
          username,
          ready: true // El host se marca automáticamente como listo
        }
      },
      createdAt: Date.now()
    })

    // Establecer el token de la sala en el estado global
    setRoomToken(roomToken)

    // Redirigir a la vista de la sala
    router.push(`/room`)
  }

  return (
    <button 
      className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg w-full"
      onClick={createRoom}
    >
      Create Room
    </button>
  )
}

export default CreateRoom
