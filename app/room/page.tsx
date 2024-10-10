"use client"

import { useEffect, useState } from 'react'
import { addPlayerToRoom, listenToPlayers, sendMessage, listenToMessages } from '@/utils/firebaseUtils'
import { useStore } from '@/stores/useStore'
import { Player, ChatMessage } from '@/types/global'

const RoomPage = () => {
  const { roomToken, username } = useStore()
  const [players, setPlayers] = useState<Player[]>([])
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!roomToken || !username) return

    // Agregar el jugador a la sala en Firebase
    addPlayerToRoom(roomToken, username)

    // Escuchar a los jugadores en tiempo real
    const unsubscribePlayers = listenToPlayers(roomToken, (players: Player[]) => {
      setPlayers(players)
    })

    // Escuchar los mensajes del chat en tiempo real
    const unsubscribeChat = listenToMessages(roomToken, (messages: ChatMessage[]) => {
      setChat(messages)
    })

    return () => {
      unsubscribePlayers()
      unsubscribeChat()
    }
  }, [roomToken, username])

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
            <li key={index} className="py-2 border-b border-gray-700 last:border-none">
              {player.username}
            </li>
          ))}
        </ul>

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
