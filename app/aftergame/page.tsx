// @/pages/aftergame/page
"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { getPlayerPoints_DB } from "@/utils/firebaseUtils"
import { useRouter } from "next/navigation"
import Confetti from 'react-confetti'

interface PlayerPoints {
  username: string
  points: number
}

export default function AfterGamePage() {
  const { roomToken } = useAppStore()
  const [playerPoints, setPlayerPoints] = useState<PlayerPoints[]>([])
  const router = useRouter()

  useEffect(() => {
    if (!roomToken) return

    const fetchPlayerPoints = async () => {
      const points = await getPlayerPoints_DB(roomToken)
      const formattedPoints = Object.entries(points).map(([username, points]) => ({
        username,
        points,
      }))
      formattedPoints.sort((a, b) => b.points - a.points)
      setPlayerPoints(formattedPoints)
    }

    fetchPlayerPoints()
  }, [roomToken])

  if (playerPoints.length === 0) {
    return <p className="text-center text-white text-lg">Loading points...</p>
  }

  const winner = playerPoints[0]

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-8">
      <h1 className="text-5xl font-bold mb-12 text-center tracking-wide animate-pulse">Final Rankings</h1>
      
      <div className="max-w-3xl mx-auto space-y-6">
        {playerPoints.map((player, index) => (
          <div
            key={player.username}
            className={`p-6 rounded-lg shadow-xl flex justify-between items-center transition-all duration-300 transform hover:scale-105 ${
              index === 0
                ? "bg-yellow-500 text-gray-900 font-bold"
                : index === 1
                ? "bg-gray-700 text-white"
                : "bg-gray-600 text-gray-200"
            }`}
          >
            <span className="font-semibold text-2xl">{player.username}</span>
            <span className="text-xl font-bold">{player.points} pts</span>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-4xl font-bold text-yellow-400 animate-bounce">🏆 Winner 🏆</h2>
        <p className="text-3xl mt-4 font-semibold tracking-wide">{winner.username}</p>
        <p className="text-lg text-gray-300">{winner.points} points</p>
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-110"
        >
          Go to Home
        </button>
      </div>

      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  )
}
