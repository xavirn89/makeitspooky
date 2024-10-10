"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation' // Importar el router
import { addPlayerToRoom, listenToPlayers, sendMessage, listenToMessages, setPlayerReady } from '@/utils/firebaseUtils'
import { useStore } from '@/stores/useStore'
import { Player, ChatMessage } from '@/types/global'

const RoomPage = () => {
  const { roomToken, username } = useStore()
  const [players, setPlayers] = useState<Player[]>([])
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])
  const router = useRouter() // Usar el router para redirección

  useEffect(() => {
    // Si no hay roomToken, redirigir a la página principal
    if (!roomToken) {
      router.push('/')
      return
    }

    if (!username) return

    // Agregar el jugador a la sala en Firebase
    addPlayerToRoom(roomToken, username)

    // Escuchar a los jugadores en tiempo real
    const unsubscribePlayers = listenToPlayers(roomToken, (players: Player[]) => {
      console.log("Players in room:", players)
      setPlayers(players)
    })

    // Escuchar los mensajes del chat en tiempo real
    const unsubscribeChat = listenToMessages(roomToken, (messages: ChatMessage[]) => {
      console.log("Messages in chat:", messages)
      setChat(messages)
    })

    return () => {
      unsubscribePlayers()
      unsubscribeChat()
    }
  }, [roomToken, username, router])

  const toggleReady = () => {
    const currentPlayer = players.find(p => p.username === username)
    if (currentPlayer) {
      setPlayerReady(roomToken!, username!, !currentPlayer.ready)
    }
  }

  const handleSendMessage = () => {
    if (message.trim() && roomToken && username) {
      console.log(`Sending message: ${message} from ${username}`)
      sendMessage(roomToken, username, message)
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold">Room: {roomToken}</h1>

      <div className="w-full max-w-md space-y-6">
        <h2 className="text-xl font-semibold">Players in the room:</h2>
        <ul className="bg-gray-800 p-4 rounded-lg shadow-md">
          {players.map((player, index) => (
            <li key={index} className="py-2 border-b border-gray-700 last:border-none flex justify-between items-center">
              <span>{player.username}</span>
              <span className={`px-2 py-1 rounded-lg ${player.ready ? 'bg-green-500' : 'bg-red-500'}`}>
                {player.ready ? 'Ready' : 'Not Ready'}
              </span>
            </li>
          ))}
        </ul>

        {/* Botón de Ready */}
        <div className="flex justify-center">
          <button
            className={`${
              players.find(p => p.username === username)?.ready ? 'bg-red-600' : 'bg-green-600'
            } hover:bg-opacity-80 text-white py-2 px-4 rounded-lg`}
            onClick={toggleReady}
          >
            {players.find(p => p.username === username)?.ready ? 'Unready' : 'Ready'}
          </button>
        </div>

        <div className="w-full">
          <h2 className="text-xl font-semibold mb-2">Chat</h2>
          <div className="h-64 bg-gray-800 p-4 rounded-lg shadow-md overflow-y-auto">
            {chat.length === 0 ? (
              <p className="text-gray-400">No messages yet</p>
            ) : (
              chat.map((chatMessage, index) => (
                <p key={index} className="py-1">
                  <strong className="text-indigo-400">{chatMessage.username}:</strong> {chatMessage.message}
                </p>
              ))
            )}
          </div>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            placeholder="Type a message"
            className="flex-grow p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoomPage
