// @/components/game/Phase0
"use client"

import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { savePlayerParameters_DB } from '@/utils/firebaseUtils'

export default function Phase0() {
  const { roomToken, round, username, roundImage } = useAppStore()
  const [fromObject, setFromObject] = useState<string>('')
  const [toObject, setToObject] = useState<string>('')
  const [textToReplaceBackground, setTextToReplaceBackground] = useState<string | null>(null)
  const [isUploaded, setIsUploaded] = useState<boolean>(false)

  const handleSaveTransformations = async () => {
    if (!fromObject || !toObject || !textToReplaceBackground || !roundImage) {
      alert('Please fill all fields')
      return
    }

    const parameters = {
      fromObject,
      toObject,
      backgroundReplacePrompt: "Create a background with a dark and scary athmosphere for a " + textToReplaceBackground
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
    } catch (error) {
      console.error('Error uploading random URL:', error)
    }
  }

  return (
    <div>
      <div className="space-y-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Reemplaza un objeto</h2>
          <input
            type="text"
            value={fromObject}
            onChange={(e) => setFromObject(e.target.value)}
            placeholder="Object to replace (e.g., 'glasses')"
            className="p-2 rounded-lg bg-gray-700 text-white mb-4 w-full"
          />
          <input
            type="text"
            value={toObject}
            onChange={(e) => setToObject(e.target.value)}
            placeholder="Replace with (e.g., 'blindfold')"
            className="p-2 rounded-lg bg-gray-700 text-white w-full"
          />
        </div>

        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Genera un nuevo background</h2>
          <input
            type="text"
            value={textToReplaceBackground || ''}
            onChange={(e) => setTextToReplaceBackground(e.target.value)}
            placeholder="Background prompt (e.g., 'haunted house with zombies')"
            className="p-2 rounded-lg bg-gray-700 text-white w-full"
          />
        </div>

        <div className="space-y-4">
          <button
            onClick={handleSaveTransformations}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full"
          >
            Save Transformations
          </button>

          <button
            onClick={handleRandomUrlUpload}
            className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full"
          >
            Upload Random URL
          </button>
        </div>
      </div>
    </div>
  )
}
