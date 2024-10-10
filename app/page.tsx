// @/app/page.tsx

import CreateRoom from '@/components/CreateRoom'
import JoinRoom from '@/components/JoinRoom'
import UsernameInput from '@/components/UsernameInput'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Make It Spooky</h1>
      
      <div className="w-full max-w-sm space-y-4">
        {/* Username input */}
        <UsernameInput />

        {/* Create room */}
        <CreateRoom />

        {/* Join Room */}
        <JoinRoom />
      </div>
    </div>
  )
}

export default HomePage
