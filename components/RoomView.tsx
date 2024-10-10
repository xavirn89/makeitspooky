"use client"

import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { useStore } from '@/stores/useStore'

interface ChatMessage {
  username: string
  message: string
}

let socket: Socket | undefined

const RoomView = () => {
  const { roomToken, username } = useStore()
  const [players, setPlayers] = useState<string[]>([])
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!roomToken || !username) return

    // Aquí es donde forzamos WebSockets y deshabilitamos polling
    socket = io('/api/socket', {
      transports: ['websocket'], // Forzar solo WebSocket
      upgrade: false // Deshabilitar el fallback a polling
    })

    // Emitir evento cuando un jugador se une
    socket.emit('joinRoom', { roomToken, username })

    // Escuchar cuando un jugador se une
    socket.on('playerJoined', (newPlayer: string) => {
      setPlayers((prevPlayers) => [...prevPlayers, newPlayer])
    })

    // Escuchar cuando un jugador sale de la sala
    socket.on('playerLeft', (player: string) => {
      setPlayers((prevPlayers) => prevPlayers.filter((p) => p !== player))
    })

    // Escuchar mensajes de chat
    socket.on('messageReceived', ({ username, message }: ChatMessage) => {
      setChat((prevChat) => [...prevChat, { username, message }])
    })

    return () => {
      if (socket) {
        socket.emit('leaveRoom', { roomToken, username })
        socket.disconnect()
      }
    }
  }, [roomToken, username])

  const sendMessage = () => {
    if (message.trim() && socket) {
      socket.emit('chatMessage', { roomToken, message, username })
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
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default RoomView
