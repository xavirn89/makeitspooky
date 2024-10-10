// @/components/UsernameInput.tsx
"use client"

import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'

const UsernameInput = () => {
  const { username, setUsername } = useStore()
  const [input, setInput] = useState<string>('')

  useEffect(() => {
    // Cargar el nombre de usuario desde localStorage
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [setUsername])

  const handleSaveUsername = () => {
    if (input.trim()) {
      // Guardar en localStorage y actualizar el estado global
      localStorage.setItem('username', input)
      setUsername(input)
    }
  }

  return (
    <div className="space-y-4">
      {username ? (
        <p className="text-lg">Welcome, <span className="font-semibold text-indigo-400">{username}</span>!</p>
      ) : (
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={input}
            placeholder="Enter your name"
            className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
            onClick={handleSaveUsername}
          >
            Save Username
          </button>
        </div>
      )}
    </div>
  )
}

export default UsernameInput
