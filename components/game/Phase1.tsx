// @/components/game/Phase1
"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { saveVote_DB, listenToVotes_DB, setRound_DB, setPhase_DB, savePlayerPoints_DB, setStage_DB, getUsedImages_DB, setRoundImage_DB, addToUsedImages_DB } from '@/utils/firebaseUtils'
import { CldImage } from "next-cloudinary"
import { Parameters } from "@/types/global"
import { imageNames } from '@/utils/constants'

interface Phase1Props {
  uploadedParameters: { [username: string]: Parameters }
  roundImage: string
}

export default function Phase1({ uploadedParameters, roundImage }: Phase1Props) {
  const { roomToken, round, username, numRounds, setPhase, setRound, usedImages, setUsedImages } = useAppStore()
  const [hasVoted, setHasVoted] = useState<string | null>(null)
  const [totalVotes, setTotalVotes] = useState<{ [voter: string]: string }>({})
  const [playerCount, setPlayerCount] = useState<number>(Object.keys(uploadedParameters).length)

  useEffect(() => {
    if (!roomToken || !round) return

    const unsubscribeVotes = listenToVotes_DB(roomToken, round, (votes) => {
      setTotalVotes(votes)
    })

    return () => {
      unsubscribeVotes()
    }
  }, [roomToken, round])

  useEffect(() => {
    if (Object.keys(totalVotes).length === playerCount && playerCount > 0) {
      calculateAndSavePoints()
    }
  }, [totalVotes, playerCount])

  const handleVote = async (votedPlayer: string) => {
    if (!roomToken || !round || !username) return
    await saveVote_DB(roomToken, round, username, votedPlayer)
    setHasVoted(votedPlayer)
  }

  const calculateAndSavePoints = async () => {
    const voteCounts: { [player: string]: number } = {}
    Object.values(totalVotes).forEach((votedPlayer) => {
      voteCounts[votedPlayer] = (voteCounts[votedPlayer] || 0) + 1
    })

    const maxVotes = Math.max(...Object.values(voteCounts))
    const playersWithMaxVotes = Object.keys(voteCounts).filter(player => voteCounts[player] === maxVotes)

    const pointsPerPlayer = Math.trunc(100 / playersWithMaxVotes.length)

    for (const player of playersWithMaxVotes) {
      await savePlayerPoints_DB(roomToken!, player, pointsPerPlayer)
    }

    const isLastRound = round === numRounds

    if (isLastRound) {
      setPhase(0)
      setPhase_DB(roomToken!, 0)
      setStage_DB(roomToken!, 2)
    } else {
      selectNewRoundImage() // Select a new round image for the next round
      setRound(round + 1)
      setPhase(0)
      setRound_DB(roomToken!, round + 1)
      setPhase_DB(roomToken!, 0)
    }
  }

  const selectNewRoundImage = async () => {
    const usedImages = await getUsedImages_DB(roomToken!)
    console.log("Used images: ", usedImages)
    setUsedImages(usedImages as string[])
  
    const availableImages = imageNames.filter(image => !usedImages.includes(image))
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]
  
    await setRoundImage_DB(roomToken!, randomImage)
    await addToUsedImages_DB(roomToken!, randomImage)
  
    console.log(`New round image selected: ${randomImage}`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Player Transformations</h1>

      {hasVoted ? (
        <div>
          <p className="text-xl">Has votado a <strong>{hasVoted}</strong></p>
          <p className="text-lg text-gray-400">Esperando a los demás jugadores...</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(uploadedParameters).map(([player, parameters]) => (
            player !== username ? (
              <div 
                key={player} 
                className="relative group p-4 border-2 border-gray-500 rounded-lg cursor-pointer"
                onClick={() => handleVote(player)}
              >
                <CldImage
                  width="960"
                  height="600"
                  src={roundImage}
                  replace={{
                    from: parameters.fromObject,
                    to: parameters.toObject,
                    preserveGeometry: true
                  }}
                  replaceBackground={{
                    prompt: parameters.backgroundReplacePrompt,
                    seed: 3
                  }}
                  alt={`${player}'s Transformation`}
                  className="rounded-lg shadow-lg"
                />
                <p className="text-center mt-2">{player}</p>

                <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-indigo-500 transition-all duration-300"></div>
              </div>
            ) : null
          ))}
        </div>
      )}

      {Object.keys(uploadedParameters).length === 1 && (
        <p className="text-gray-400">Waiting for other players to submit their transformations...</p>
      )}
    </div>
  )
}
