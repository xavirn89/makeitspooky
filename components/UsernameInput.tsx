// @/components/UsernameInput.tsx
"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { IoMdRefresh } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

const UsernameInput = () => {
  const { username, setUsername } = useAppStore()
  const [input, setInput] = useState('')

  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [setUsername])

  const handleSaveUsername = useCallback(() => {
    if (input.trim()) {
      localStorage.setItem('username', input)
      setUsername(input)
    }
  }, [input, setUsername])

  const handleChangeUsername = useCallback(() => {
    localStorage.removeItem('username')
    setUsername('')
    setInput('')
  }, [setUsername])

  return (
    <div className="flex justify-center">
      {username ? (
        <div className="flex gap-3 items-center">
          <p className="text-xl">Welcome, <span className="font-semibold text-indigo-400">{username}</span>!</p>
          <button 
            className="bg-slate-600 hover:bg-slate-700 text-white py-1 px-2 rounded-lg"
            onClick={handleChangeUsername}
            aria-label="Change Username"
          >
            <IoMdRefresh size={22} />
          </button>
        </div>
      ) : (
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={input}
            placeholder="Enter your name"
            className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg"
            onClick={handleSaveUsername}
          >
            <FaCheck size={18} />
          </button>
        </div>
      )}
    </div>
  )
}

export default UsernameInput
