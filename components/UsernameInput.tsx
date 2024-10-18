// @/components/UsernameInput.tsx
"use client"

import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'

const UsernameInput = () => {
  const { username, setUsername } = useAppStore()
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

  const handleChangeUsername = () => {
    // Limpiar el nombre de usuario de localStorage y del estado global
    localStorage.removeItem('username')
    setUsername('')
    setInput('') // Limpiar el input también
  }

  return (
    <div className="space-y-4">
      {username ? (
        <div>
          <p className="text-lg">Welcome, <span className="font-semibold text-indigo-400">{username}</span>!</p>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mt-2"
            onClick={handleChangeUsername}
          >
            Change Username
          </button>
        </div>
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
