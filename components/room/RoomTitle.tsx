// @/components/room/RoomTitle
"use client"

import { theme } from '@cloudinary/url-gen/actions/effect'
import { useState } from 'react'
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface RoomTitleProps {
  roomToken: string
}

const RoomTitle = ({ roomToken }: RoomTitleProps) => {
  const [showToken, setShowToken] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(roomToken)
    toast.success('Room token copied!', {
      theme: 'dark',
      autoClose: 2000,
    })
  }

  return (
    <div className="flex items-center space-x-4 w-full">
      <h1 className="text-3xl font-bold">Room:</h1>
      <div className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-lg">
        <span>{showToken ? roomToken : '●'.repeat(roomToken.length)}</span>
        <button
          onClick={() => setShowToken((prev) => !prev)}
          className="ml-2 text-gray-300 hover:text-white"
        >
          {showToken ? <AiFillEyeInvisible className="h-5 w-5" /> : <AiFillEye className="h-5 w-5" />}
        </button>
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        onClick={handleCopy}
      >
        Copy
      </button>
      <ToastContainer />
    </div>
  )
}

export default RoomTitle
