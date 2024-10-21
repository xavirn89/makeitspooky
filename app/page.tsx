// @/app/page.tsx

import CreateRoom from '@/components/CreateRoom'
import Branches from '@/components/home/Branches'
import JoinRoom from '@/components/JoinRoom'
import UsernameInput from '@/components/UsernameInput'

const HomePage = () => {
  return (
    <div className="relative min-h-screen bg-gray-900 text-white flex flex-col items-center p-8 overflow-hidden">
      <Branches />

      <div className="flex flex-col flex-1 gap-28 items-center mt-10 w-1/2">
        <h1 className="font-changa-one text-7xl font-black mb-8 animate-glowFlicker text-yellow-500">
          Make It Spooky
        </h1>

        <div className="w-full space-y-6">
          <UsernameInput />

          <div className="flex bg-slate-800/90 w-full p-10 space-x-6 rounded-2xl shadow-lg shadow-slate-900/50 border border-slate-600/50 backdrop-blur-lg">
            <div className="w-1/2 flex flex-col space-y-4 border-r border-slate-500/50 pr-4">
              <div className="flex-grow space-y-4">
                <h2 className="text-3xl font-semibold text-gray-100 text-center">Create a Room</h2>
                <p className="text-md text-gray-400 text-center">
                  Create a room and invite your friends to join the fun!
                </p>
              </div>
              <div className="mt-auto">
                <CreateRoom />
              </div>
            </div>

            <div className="w-1/2 flex flex-col space-y-4">
              <div className="flex-grow space-y-4 mb-10">
                <h2 className="text-3xl font-semibold text-gray-100 text-center">Join a Room</h2>
                <p className="text-md text-gray-400 text-center">
                  Join a room by entering the room code shared by your friends.
                </p>
              </div>
              <div className="mt-auto">
                <JoinRoom />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
