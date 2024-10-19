// @/components/Navbar.tsx
import CloseRoomButton from '@/components/CloseRoomButton'
import RoomTitle from '@/components/room/RoomTitle'
import React from 'react'

interface NavbarProps {
  roomToken?: string
  closeButton?: boolean
  showRoomTitle?: boolean
}

const Navbar = ({ roomToken, closeButton, showRoomTitle }: NavbarProps) => {
  return (
    <div className='flex w-full max-w-full justify-between bg-gray-950/35 p-4 px-20 mb-10'>
      <h1 className="font-changa-one text-xl font-black text-yellow-500 flex-shrink-0">
        Make It Spooky
      </h1>
      {roomToken && showRoomTitle && (
        <div className="flex-shrink-0">
          <RoomTitle roomToken={roomToken} smallText />
        </div>
      )}
      {roomToken && closeButton && (
        <div className="flex-shrink-0">
          <CloseRoomButton />
        </div>
      )}
    </div>
  )
}

export default Navbar
