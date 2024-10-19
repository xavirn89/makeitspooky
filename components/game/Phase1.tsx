// @/components/game/Phase1
"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/stores/useAppStore"
import { saveVote_DB, listenToVotes_DB, setRound_DB, setPhase_DB, savePlayerPoints_DB, setStage_DB, getUsedImages_DB, setRoundImage_DB, addToUsedImages_DB } from '@/utils/firebaseUtils'
import { CldImage, getCldImageUrl } from "next-cloudinary"
import { Parameters } from "@/types/global"
import { imageNames } from '@/utils/constants'

interface Phase1Props {
  uploadedParameters: { [username: string]: Parameters }
  roundImage: string
  imHost: boolean | undefined
}

export default function Phase1({ uploadedParameters, roundImage, imHost }: Phase1Props) {
  const { roomToken, round, username, numRounds, setPhase, setRound, setUsedImages } = useAppStore()
  const [hasVoted, setHasVoted] = useState<string | null>(null)
  const [totalVotes, setTotalVotes] = useState<{ [voter: string]: string }>({})
  const [playerCount] = useState<number>(Object.keys(uploadedParameters).length)
  const [blurDataURL, setBlurDataURL] = useState<string | null>(null)

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

  useEffect(() => {
    if (!roundImage) return

    // Generate the blurDataURL for the placeholder effect
    const generateBlurDataURL = async () => {
      const imageUrl = getCldImageUrl({
        src: roundImage,
        width: 100, // Small width for quick loading blur effect
      })
      const response = await fetch(imageUrl)
      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString("base64")
      const dataUrl = `data:${response.headers.get('content-type')};base64,${base64}`
      setBlurDataURL(dataUrl)
    }

    generateBlurDataURL()
  }, [roundImage])

  const handleVote = async (votedPlayer: string) => {
    if (!roomToken || !round || !username) return
    await saveVote_DB(roomToken, round, username, votedPlayer)
    setHasVoted(votedPlayer)
  }

  const calculateAndSavePoints = async () => {
    if (!roomToken || !round) return

    if (imHost) {
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
    }

    const isLastRound = round === numRounds

    if (isLastRound) {
      setPhase(0)
      setPhase_DB(roomToken!, 0)
      setStage_DB(roomToken!, 2)
    } else {
      await selectNewRoundImage()
      setRound(round + 1)
      setPhase(0)
      setRound_DB(roomToken!, round + 1)
      setPhase_DB(roomToken!, 0)
    }
  }

  const selectNewRoundImage = async () => {
    const usedImages = await getUsedImages_DB(roomToken!)
    setUsedImages(usedImages as string[])

    const availableImages = imageNames.filter(image => !usedImages.includes(image))
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)]

    await setRoundImage_DB(roomToken!, randomImage)
    await addToUsedImages_DB(roomToken!, randomImage)

    console.log(`New round image selected: ${randomImage}`)
  }

  return (
    <div className="flex w-full h-full flex-col gap-10">
      <div className="flex flex-col w-full gap-10">
        <div className="bg-gray-800/25 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Player Transformations</h2>
          <p className="text-gray-400 mb-4">
            Vote for the image that you find the most spooky, scary, or original! Click on the image to submit your vote.
          </p>
        </div>
  
        {!hasVoted && (
          <div className="grid grid-cols-2 gap-4 w-full">
            {Object.entries(uploadedParameters).map(([player, parameters]) =>
              player !== username ? (
                <div
                  key={player}
                  className="relative group p-4 border-2 border-gray-500 rounded-lg cursor-pointer"
                  onClick={() => handleVote(player)}
                >
                  <div className="w-full h-full">
                    {parameters ? (
                      <CldImage
                        sizes="100vw"
                        width="1024"
                        height="1024"
                        src={roundImage}
                        replace={{
                          from: parameters.fromObject,
                          to: parameters.toObject,
                          preserveGeometry: true,
                        }}
                        replaceBackground={{
                          prompt: parameters.backgroundReplacePrompt,
                          seed: 3,
                        }}
                        alt="Transformation"
                        placeholder="blur"
                        blurDataURL={blurDataURL || ''}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                      />
                    ) : (
                      <img
                        width="640"
                        height="640"
                        src={`/images/${roundImage}.jpg`}
                        alt={`Round image: ${roundImage}`}
                        className="w-full h-full object-cover rounded-lg shadow-lg"
                      />
                    )}
                  </div>
  
                  <div className="absolute inset-0 border-2 border-transparent rounded-lg group-hover:border-indigo-500 transition-all duration-300"></div>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
  
      {hasVoted && (
        <div className="text-xl text-white">
          <p>
            You voted for <strong>{hasVoted}</strong>. Waiting for other players to finish voting...
          </p>
        </div>
      )}
    </div>
  )  
}
