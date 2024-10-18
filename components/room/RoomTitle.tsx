// @/components/room/RoomTitle.tsx
"use client"

import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface RoomTitleProps {
  roomToken: string
  smallText?: boolean
}

const RoomTitle = ({ roomToken, smallText = false }: RoomTitleProps) => {
  const [showToken, setShowToken] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomToken)
    toast.success('Room token copied!', {
      theme: 'dark',
      autoClose: 2000,
    })
  }

  return (
    <div className={`flex items-center space-x-4 w-full ${smallText ? 'text-sm' : 'text-base'}`}>
      <h1 className={`font-bold ${smallText ? 'text-xl' : 'text-3xl'}`}>Room</h1>
      <div className={`flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg ${smallText ? 'text-xs' : ''}`}>
        <span>{showToken ? roomToken : '●'.repeat(roomToken.length)}</span>
        <button
          onClick={() => setShowToken((prev) => !prev)}
          className="ml-2 text-gray-300 hover:text-white"
        >
          {showToken ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
        </button>
      </div>
      <button
        className={`bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg ${smallText ? 'text-xs py-1 px-2' : ''}`}
        onClick={handleCopy}
      >
        Copy
      </button>
      <ToastContainer />
    </div>
  )
}

export default RoomTitle
