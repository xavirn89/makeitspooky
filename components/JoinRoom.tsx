"use client"
import { useState } from 'react'
import { db } from '@/utils/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useStore } from '@/stores/useStore'

const JoinRoom = () => {
  const { username, setRoomToken } = useStore()
  const [roomToken, setInputToken] = useState('')

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

    // Actualizar jugadores en Firestore
    const players = roomSnapshot.data().players || []
    await updateDoc(roomRef, {
      players: [...players, username]
    })

    setRoomToken(roomToken)
    alert(`Joined room ${roomToken}`)
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
