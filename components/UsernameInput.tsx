"use client"
import { useState, useEffect } from 'react'
import { useStore } from '@/stores/useStore'

const UsernameInput = () => {
  const { username, setUsername } = useStore()
  const [input, setInput] = useState<string>('')

  useEffect(() => {
    const savedUsername = localStorage.getItem('username')
    if (savedUsername) {
      setUsername(savedUsername)
    }
  }, [setUsername])

  const handleSaveUsername = () => {
    if (input) {
      localStorage.setItem('username', input)
      setUsername(input)
    }
  }

  return (
    <div>
      {username ? (
        <p>Welcome, {username}!</p>
      ) : (
        <div>
          <input
            type="text"
            value={input}
            placeholder="Enter your name"
            onChange={(e) => setInput(e.target.value)}
            className='text-neutral-700'
          />
          <button onClick={handleSaveUsername}>Save Username</button>
        </div>
      )}
    </div>
  )
}

export default UsernameInput
