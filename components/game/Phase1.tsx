"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { saveVote_DB, listenToVotes_DB, setRound_DB, setPhase_DB, savePlayerPoints_DB, setStage_DB } from '@/utils/firebaseUtils'

interface Phase1Props {
  uploadedUrls: { [username: string]: string }
}

export default function Phase1({ uploadedUrls }: Phase1Props) {
  const { roomToken, round, username, numRounds, setPhase, setRound } = useAppStore()
  const [hasVoted, setHasVoted] = useState<string | null>(null)
  const [totalVotes, setTotalVotes] = useState<{ [voter: string]: string }>({})
  const [playerCount, setPlayerCount] = useState<number>(Object.keys(uploadedUrls).length)

  useEffect(() => {
    if (!roomToken || !round) return

    // Escuchar los votos en la base de datos
    const unsubscribeVotes = listenToVotes_DB(roomToken, round, (votes) => {
      setTotalVotes(votes)
    })

    return () => {
      unsubscribeVotes()
    }
  }, [roomToken, round])

  useEffect(() => {
    // Si todos los jugadores han votado
    if (Object.keys(totalVotes).length === playerCount && playerCount > 0) {
      // Calcular los puntos y actualizar la base de datos
      calculateAndSavePoints()
    }
  }, [totalVotes, playerCount])

  const handleVote = async (votedPlayer: string) => {
    if (!roomToken || !round || !username) return
    await saveVote_DB(roomToken, round, username, votedPlayer)
    setHasVoted(votedPlayer)
  }

  const calculateAndSavePoints = async () => {
    // Contar los votos para cada jugador
    const voteCounts: { [player: string]: number } = {}
    Object.values(totalVotes).forEach((votedPlayer) => {
      if (voteCounts[votedPlayer]) {
        voteCounts[votedPlayer]++
      } else {
        voteCounts[votedPlayer] = 1
      }
    })
  
    // Encontrar los jugadores con más votos
    const maxVotes = Math.max(...Object.values(voteCounts))
    const playersWithMaxVotes = Object.keys(voteCounts).filter(player => voteCounts[player] === maxVotes)
  
    // Calcular puntos por jugador (truncar en caso de empate)
    const pointsPerPlayer = Math.trunc(100 / playersWithMaxVotes.length)
  
    // Guardar los puntos para cada jugador
    for (const player of playersWithMaxVotes) {
      await savePlayerPoints_DB(roomToken!, player, pointsPerPlayer)
    }
  
    // Verificar si es la última ronda
    const isLastRound = round === numRounds
    console.log('isLastRound:', isLastRound)
    console.log('round:', round)
    console.log('numRounds:', numRounds)
  
    if (isLastRound) {
      // Si es la última ronda, cambiar el stage a 2
      setPhase(0) // Resetear la phase localmente
      setPhase_DB(roomToken!, 0)
      setStage_DB(roomToken!, 2) // Cambiar el stage a 2 para finalizar el juego
    } else {
      // Si no es la última ronda, cambiar al siguiente round y reiniciar phase
      setRound(round + 1)
      setPhase(0)
      setRound_DB(roomToken!, round + 1)
      setPhase_DB(roomToken!, 0)
    }
  }
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Player URLs</h1>

      {hasVoted ? (
        <div>
          <p className="text-xl">Has votado a <strong>{hasVoted}</strong></p>
          <p className="text-lg text-gray-400">Esperando a los demás jugadores...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(uploadedUrls).map(([player, url]) => (
            player !== username ? (
              <div 
                key={player} 
                className="relative group p-4 border-2 border-gray-500 rounded-lg cursor-pointer"
                onClick={() => handleVote(player)}
              >
                <img src={url} alt={`${player}'s image`} className="w-full h-auto rounded-lg" />
                <p className="text-center mt-2">{player}</p>

                {/* Animación al pasar el ratón */}
                <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-indigo-500 transition-all duration-300"></div>
              </div>
            ) : null
          ))}
        </div>
      )}

      {Object.keys(uploadedUrls).length === 1 && (
        <p className="text-gray-400">Waiting for other players to upload their images...</p>
      )}
    </div>
  )
}
