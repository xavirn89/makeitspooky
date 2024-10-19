"use client"

import { useAppStore } from '@/stores/useAppStore'
import { useEffect, useState } from 'react'
import { deleteRoom_DB, getRoomHost_DB } from '@/utils/firebaseUtils'
import { useRouter } from 'next/navigation'

const CloseRoomButton = () => {
  const { roomToken, username } = useAppStore()
  const [isHost, setIsHost] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const checkIfHost = async () => {
      if (roomToken && username) {
        const host = await getRoomHost_DB(roomToken)
        setIsHost(host === username)
      }
    }
    checkIfHost()
  }, [roomToken, username])

  const handleCloseRoom = async () => {
    if (!roomToken) return
    const confirmation = confirm('Are you sure you want to close and delete the room? This action cannot be undone.')
    if (confirmation) {
      await deleteRoom_DB(roomToken)
      router.push('/')
    }
  }

  if (!isHost) return null

  return (
    <button
      onClick={handleCloseRoom}
      className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-lg"
    >
      <p className='font-bold'>Close Room</p>
    </button>
  )
}

export default CloseRoomButton
