"use client"

import { useState } from 'react'
import { db } from '@/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useStore } from '@/stores/useStore'
import { useRouter } from 'next/navigation'

const JoinRoom = () => {
  const { username, setRoomToken } = useStore()
  const [roomToken, setInputToken] = useState<string>('')
  const router = useRouter()

  const joinRoom = async () => {
    if (!username) {
      alert('You must set a username first!')
      return
    }

    // Referencia al documento de la sala en Firestore
    const roomRef = doc(db, 'rooms', roomToken)
    const roomSnapshot = await getDoc(roomRef)

    if (!roomSnapshot.exists()) {
      alert('Room not found!')
      return
    }

    // Actualizar la lista de jugadores en Firestore
    const players = roomSnapshot.data().players || []
    await updateDoc(roomRef, {
      players: [...players, username]
    })

    setRoomToken(roomToken)
    router.push(`/room`) // Redirigir a la vista de la sala
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Enter room token"
        value={roomToken}
        onChange={(e) => setInputToken(e.target.value)}
      />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  )
}

export default JoinRoom
