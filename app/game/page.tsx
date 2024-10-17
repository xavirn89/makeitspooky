"use client"

import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import Phase0 from '@/components/game/Phase0'
import Phase1 from '@/components/game/Phase1'
import { listenToPlayerUrls_DB, listenToPlayers_DB, setPhase_DB, listenToRound_DB, listenToStage_DB, getNumRounds_DB } from '@/utils/firebaseUtils'
import CloseRoomButton from '@/components/CloseRoomButton'
import { useRouter } from 'next/navigation'

export default function GamePage() {
  const { roomToken, stage, round, username, phase, numRounds, setPhase, setRound, setNumRounds, setStage } = useAppStore()
  const [allPlayersSubmitted, setAllPlayersSubmitted] = useState<boolean>(false)
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [uploadedUrls, setUploadedUrls] = useState<{ [username: string]: string }>({})
  const router = useRouter()

  useEffect(() => {
    if (!roomToken || round === undefined) return

    // Escuchar cambios en las URLs subidas por los jugadores
    const unsubscribeUrls = listenToPlayerUrls_DB(roomToken, round, (urls) => {
      setUploadedUrls(urls)
    })

    // Escuchar los jugadores en la sala
    const unsubscribePlayers = listenToPlayers_DB(roomToken, (players) => {
      setPlayerCount(players.length)
    })

    // Escuchar cambios en el round
    const unsubscribeRound = listenToRound_DB(roomToken, (newRound) => {
      setRound(newRound)
    })

    // Escuchar cambios en el stage
    const unsubscribeStage = listenToStage_DB(roomToken, (newStage) => {
      setStage(newStage)
      if (newStage === 2) {
        router.push('/aftergame')
      }
    })

    return () => {
      unsubscribeUrls()
      unsubscribePlayers()
      unsubscribeRound()
      unsubscribeStage()
    }
  }, [roomToken, round])

  useEffect(() => {
    if (!roomToken) return

    // Obtener el número de rondas de la sala
    const getNumRounds = async () => {
      const numRounds = await getNumRounds_DB(roomToken)
      setNumRounds(numRounds || 3)
    }
    getNumRounds()
  }, [roomToken])

  useEffect(() => {
    // Si el número de URLs es igual al número de jugadores, todos han subido sus URLs
    if (Object.keys(uploadedUrls).length === playerCount && playerCount > 0) {
      setAllPlayersSubmitted(true)
      setPhase(1)
      setPhase_DB(roomToken!, 1)
    }
  }, [uploadedUrls, playerCount, setPhase])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <p className="text-xl">Room Token: {roomToken}</p>
      <p className="text-xl">Current Stage: {stage}</p>
      <h1 className="text-4xl font-bold mb-8">Round {round}</h1>
      <p className="text-xl">NumRounds: {numRounds}</p>

      {/* Mostrar contenido basado en la fase */}
      {phase === 0 && <Phase0 />}
      {phase === 1 && <Phase1 uploadedUrls={uploadedUrls} />}

      <CloseRoomButton />
    </div>
  )
}
