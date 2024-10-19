// @/components/game/Phase0
"use client"

import { useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { savePlayerParameters_DB } from '@/utils/firebaseUtils'

export default function Phase0() {
  const { roomToken, round, username, roundImage } = useAppStore()
  const [fromObject, setFromObject] = useState<string>('')
  const [toObject, setToObject] = useState<string>('')
  const [textToReplaceBackground, setTextToReplaceBackground] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState<boolean>(false)

  const cleanText = (text: string) => {
    return text.replace(/[^\w\s]/gi, '')
  }

  const handleSaveTransformations = async () => {
    if (!fromObject || !toObject || !textToReplaceBackground || !roundImage) {
      alert('Please fill all fields')
      return
    }

    // Clean the background replacement text
    const cleanedText = cleanText(textToReplaceBackground)

    const parameters = {
      fromObject,
      toObject,
      backgroundReplacePrompt: "Create a background with a dark and scary atmosphere for a " + cleanedText
    }

    try {
      await savePlayerParameters_DB(roomToken!, round!, username!, parameters)
      setIsUploaded(true)
    } catch (error) {
      console.error('Error saving parameters:', error)
    }
  }

  const handleRandomUrlUpload = async () => {
    const randomUrl = `https://example.com/${Math.random().toString(36).substring(2, 17)}`
    try {
      await savePlayerParameters_DB(roomToken!, round!, username!, { fromObject: "random", toObject: "random", backgroundReplacePrompt: randomUrl })
      setIsUploaded(true)
    } catch (error) {
      console.error('Error uploading random URL:', error)
    }
  }

  if (isUploaded) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mb-8"></div>
        <p className="text-xl text-white">Waiting for other players...</p>
      </div>
    )
  }

  return (
    <div className="flex w-full h-full flex-col gap-10">
      <div className='flex w-full gap-10'>
        <div className='flex flex-col w-8/12 h-full gap-10'>
          {roundImage && (
            <div className="flex justify-center">
              <img
                src={`/images/${roundImage}.jpg`}
                alt={`Round image: ${roundImage}`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          )}
          <div className="bg-gray-800/25 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-white mb-4">Transform the Image</h2>
            <p className="text-gray-400 mb-4">Enter the transformations you want to apply to this image to make it as scary and terrifying as possible.</p>
          </div>
        </div>

        <div className='flex flex-col w-4/12 h-full gap-10'>
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Replace an Object</h2>
              <p className="text-gray-400 mb-4">Enter the object you want to replace and the object you want to replace it with.</p>
              <input
                type="text"
                value={fromObject}
                onChange={(e) => setFromObject(e.target.value)}
                placeholder="Object (e.g., 'pencil')"
                className="p-3 rounded-lg bg-gray-700 text-white mb-4 w-full"
              />
              <input
                type="text"
                value={toObject}
                onChange={(e) => setToObject(e.target.value)}
                placeholder="Replace with (e.g., 'knife')"
                className="p-3 rounded-lg bg-gray-700 text-white w-full"
              />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-4">Generate a New Background</h2>
              <p className="text-gray-400 mb-4">Enter a prompt to generate a new background with a dark and scary atmosphere.</p>
              <input
                type="text"
                value={textToReplaceBackground || ''}
                onChange={(e) => setTextToReplaceBackground(e.target.value)}
                placeholder="(e.g., 'green hill with zombies')"
                className="p-3 rounded-lg bg-gray-700 text-white w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          onClick={handleSaveTransformations}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Save Transformations
        </button>

        <button
          onClick={handleRandomUrlUpload}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          Upload Random URL
        </button>
      </div>
    </div>
  )
}
