// @/components/room/Chat
"use client"

import { useEffect, useState } from 'react'
import { ChatMessage } from '@/types/global'
import { useAppStore } from '@/stores/useAppStore'
import { listenToMessages_DB, sendMessage_DB } from '@/utils/firebaseUtils'
const Chat = () => {
  const { username, roomToken} = useAppStore()
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])

  useEffect(() => {
    if (!username || !roomToken) return

    const unsubscribeChat = listenToMessages_DB(roomToken, (messages: ChatMessage[]) => {
      setChat(messages)
    })

    return () => {
      unsubscribeChat()
    }
  }, [username])

  const handleSendMessage = () => {
    if (message.trim() && roomToken && username) {
      sendMessage_DB(roomToken, username, message)
      setMessage('')
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
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
  )
}

export default Chat
