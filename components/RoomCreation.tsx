"use client"
import { v4 as uuidv4 } from 'uuid'
import { useStore } from '@/stores/useStore'
import { db } from '@/utils/firebase'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const RoomCreation = () => {
  const { username, setRoomToken } = useStore()
  const router = useRouter()

  const createRoom = async () => {
    if (!username) {
      alert('You must set a username first!')
      return
    }

    const roomToken = uuidv4()

    // Guardar la sala en Firestore
    const roomRef = doc(db, 'rooms', roomToken)
    await setDoc(roomRef, {
      host: username,
      players: [username],
      createdAt: new Date()
    })

    setRoomToken(roomToken)
    router.push(`/room`) // Redirigir a la vista de la sala
  }

  return <button onClick={createRoom}>Create Room</button>
}

export default RoomCreation
