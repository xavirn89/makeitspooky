// @/components/room/Chat
"use client"

import { useEffect, useState, useRef } from 'react'
import { ChatMessage } from '@/types/global'
import { useAppStore } from '@/stores/useAppStore'
import { listenToMessages_DB, sendMessage_DB } from '@/utils/firebaseUtils'

const Chat = () => {
  const { username, roomToken } = useAppStore()
  const [message, setMessage] = useState<string>('')
  const [chat, setChat] = useState<ChatMessage[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const sendButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (!username || !roomToken) return

    const unsubscribeChat = listenToMessages_DB(roomToken, (messages: ChatMessage[]) => {
      setChat(messages)
    })

    return () => {
      unsubscribeChat()
    }
  }, [username, roomToken])

  const handleSendMessage = () => {
    if (message.trim() && roomToken && username) {
      sendMessage_DB(roomToken, username, message)
      setMessage('')

      if (inputRef.current) {
        inputRef.current.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      if (sendButtonRef.current) {
        sendButtonRef.current.click()
      }
    }
  }

  return (
    <div className='flex flex-col w-full h-full gap-6'>
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-2">Chat</h2>
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
          onKeyDown={handleKeyDown}
          ref={inputRef}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
          onClick={handleSendMessage}
          ref={sendButtonRef}
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
