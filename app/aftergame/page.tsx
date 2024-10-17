"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { getPlayerPoints_DB } from "@/utils/firebaseUtils"
import { useRouter } from "next/navigation"

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

    // Obtener los puntos de los jugadores de la base de datos
    const fetchPlayerPoints = async () => {
      const points = await getPlayerPoints_DB(roomToken)
      const formattedPoints = Object.entries(points).map(([username, points]) => ({
        username,
        points,
      }))
      // Ordenar los jugadores por puntos, de mayor a menor
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Final Rankings</h1>
      
      <div className="max-w-2xl mx-auto space-y-4">
        {playerPoints.map((player, index) => (
          <div
            key={player.username}
            className={`p-4 rounded-lg shadow-lg flex justify-between items-center ${
              index === 0 ? "bg-yellow-500 text-gray-900" : "bg-gray-800"
            }`}
          >
            <span className="font-semibold text-xl">{player.username}</span>
            <span className="text-lg font-bold">{player.points} pts</span>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold">🏆 Winner 🏆</h2>
        <p className="text-2xl mt-4 font-semibold">{winner.username}</p>
        <p className="text-lg text-gray-400">{winner.points} points</p>
      </div>

      {/* Botón para volver a la página principal */}
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Go to Home
        </button>
      </div>
    </div>
  )
}
