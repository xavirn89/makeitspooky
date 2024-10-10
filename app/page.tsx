// @/app/page.tsx

import CreateRoom from '@/components/CreateRoom'
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
        <div className="flex flex-col space-y-4">
          <input 
            type="text" 
            placeholder="Enter room token to join" 
            className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg">
            Join Room
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
