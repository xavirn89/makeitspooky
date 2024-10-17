"use client"

import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { CldImage, getCldImageUrl } from 'next-cloudinary'
import { savePlayerUrl_DB } from '@/utils/firebaseUtils'

// Generar una URL aleatoria de 15 caracteres
const generateRandomUrl = () => {
  return Math.random().toString(36).substring(2, 17)
}

export default function Phase0() {
  const { roomToken, round, username } = useAppStore()
  const [fromObject, setFromObject] = useState<string>('')
  const [toObject, setToObject] = useState<string>('')
  const [textToReplaceBackground, setTextToReplaceBackground] = useState<string | null>(null)
  const [transformedUrl, setTransformedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [isUploaded, setIsUploaded] = useState<boolean>(false)

  const handleReplace = () => {
    if (!fromObject || !toObject || !textToReplaceBackground) {
      alert('Please fill all fields')
      return
    }

    const url = getCldImageUrl({
      width: 960,
      height: 600,
      src: 'doctor123456',
      replace: [fromObject, toObject],
      replaceBackground: textToReplaceBackground || ''
    })

    setTransformedUrl(url)
    setLoading(true)
  }

  // Subir la URL transformada a la base de datos cuando la imagen esté lista
  useEffect(() => {
    const uploadTransformedUrl = async () => {
      if (transformedUrl && !isUploaded) {
        try {
          await savePlayerUrl_DB(roomToken!, round!, username!, transformedUrl)
          console.log('URL uploaded successfully')
          setIsUploaded(true) // Marcamos como subida para evitar duplicaciones
        } catch (error) {
          console.error('Error uploading URL:', error)
        }
      }
    }

    uploadTransformedUrl()
  }, [transformedUrl, roomToken, round, username, isUploaded])

  // Manejar el botón de subida de una URL aleatoria para pruebas
  const handleRandomUrlUpload = async () => {
    const randomUrl = `https://example.com/${generateRandomUrl()}`
    try {
      await savePlayerUrl_DB(roomToken!, round!, username!, randomUrl)
      console.log('Random URL uploaded successfully')
    } catch (error) {
      console.error('Error uploading random URL:', error)
    }
  }

  return (
    <div>
      <div className="space-y-4">
        {/* Input para el objeto que queremos reemplazar */}
        <input
          type="text"
          value={fromObject}
          onChange={(e) => setFromObject(e.target.value)}
          placeholder="Object to replace (e.g., 'glasses')"
          className="p-2 rounded-lg bg-gray-700 text-white"
        />

        {/* Input para el objeto de reemplazo */}
        <input
          type="text"
          value={toObject}
          onChange={(e) => setToObject(e.target.value)}
          placeholder="Replace with (e.g., 'blindfold')"
          className="p-2 rounded-lg bg-gray-700 text-white"
        />

        {/* Input para el fondo a reemplazar */}
        <input
          type="text"
          value={textToReplaceBackground || ''}
          onChange={(e) => setTextToReplaceBackground(e.target.value)}
          placeholder="Text to replace background (e.g., 'haunted house with zombies')"
          className="p-2 rounded-lg bg-gray-700 text-white"
        />

        {/* Botón para aplicar la transformación */}
        <button
          onClick={handleReplace}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Apply Replace
        </button>

        {/* Botón para subir una URL aleatoria para pruebas */}
        <button
          onClick={handleRandomUrlUpload}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          Upload Random URL
        </button>
      </div>

      {/* Mostrar la URL transformada */}
      {transformedUrl && (
        <div className="mt-8">
          <p>Transformed URL:</p>
          <p className="text-sm text-gray-400">{transformedUrl}</p>
        </div>
      )}

      {/* Mostrar el loading animation mientras la imagen está cargando */}
      {loading && (
        <div className="mt-8">
          <p>Loading image...</p>
          {/* Puedes reemplazar el siguiente div con un spinner o animación de carga */}
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      )}

      {/* Display the transformed image using CldImage */}
      {transformedUrl && (
        <div className="mt-8">
          <CldImage
            src={transformedUrl}
            width="600"
            height="600"
            preserveTransformations
            alt="Transformed Image"
            onLoad={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        </div>
      )}
    </div>
  )
}
