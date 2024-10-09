"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/stores/useStore'
import { db } from '@/utils/firebase'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'

const RoomView = () => {
  const { roomToken, username } = useStore()
  const [players, setPlayers] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!roomToken) {
      // Si no hay roomToken, redirige a la página principal
      router.push('/')
      return
    }

    const fetchRoomData = async () => {
      const roomRef = doc(db, 'rooms', roomToken)
      const roomSnapshot = await getDoc(roomRef)

      if (roomSnapshot.exists()) {
        const roomData = roomSnapshot.data()
        setPlayers(roomData.players)
      }
    }

    fetchRoomData()
  }, [roomToken, router])

  const handleCopyToken = () => {
    if (roomToken) {
      navigator.clipboard.writeText(roomToken)
      alert('Token copied to clipboard!')
    }
  }

  const handleDeleteRoom = async () => {
    if (!roomToken) return

    const roomRef = doc(db, 'rooms', roomToken)
    await deleteDoc(roomRef)
    alert('Room deleted!')
    router.push('/') // Vuelve a la pantalla principal
  }

  return (
    <div>
      <h1>Room: {roomToken}</h1>

      <h2>Players in the room:</h2>
      <ul>
        {players.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>

      <button onClick={handleCopyToken}>Copy Token</button>
      <button onClick={handleDeleteRoom}>Delete Room</button>
    </div>
  )
}

export default RoomView
