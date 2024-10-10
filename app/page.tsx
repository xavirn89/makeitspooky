"use client"

import UsernameInput from '@/components/UsernameInput'
import RoomCreation from '@/components/RoomCreation'
import JoinRoom from '@/components/JoinRoom'

const HomePage = () => {
  return (
    <div>
      <UsernameInput />
      <RoomCreation />
      <JoinRoom />
    </div>
  )
}

export default HomePage
