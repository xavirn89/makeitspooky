"use client"

import { useEffect, useState } from 'react'
import { addPlayerToRoom, listenToPlayers, sendMessage, listenToMessages } from '@/utils/firebaseUtils'
import { useStore } from '@/stores/useStore'

interface ChatMessage {
  username: string
  message: string
}

const RoomView = () => {
  const { roomToken, username } = useStore()
  const [players, setPlayers] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!roomToken || !username) return

    // Agregar el jugador a la sala en Firebase
    addPlayerToRoom(roomToken, username)

    // Escuchar a los jugadores en tiempo real
    const unsubscribePlayers = listenToPlayers(roomToken, (players) => {
      setPlayers(players)
    })

    // Escuchar los mensajes del chat en tiempo real
    const unsubscribeChat = listenToMessages(roomToken, (messages) => {
      setChat(messages)
    })

    return () => {
      // Cleanup: puedes eliminar al jugador aquí si lo deseas
      unsubscribePlayers()
      unsubscribeChat()
    }
  }, [roomToken, username])

  const handleSendMessage = () => {
    if (message.trim() && roomToken && username) {
      sendMessage(roomToken, username, message)
      setMessage('') // Limpiar el input del mensaje
    }
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

      <div>
        <h2>Chat</h2>
        <div>
          {chat.map((chatMessage, index) => (
            <p key={index}>
              <strong>{chatMessage.username}: </strong> {chatMessage.message}
            </p>
          ))}
        </div>
        <input
          type="text"
          value={message}
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default RoomView
