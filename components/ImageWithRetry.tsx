import { useState } from "react"
import { CldImage } from "next-cloudinary"
import { Parameters } from "@/types/global"

interface ImageWithRetryProps {
  parameters: Parameters
  roundImage: string
  blurDataURL: string | null
  player: string
  setLoadingImages: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
}

const MAX_RETRIES = 3

const ImageWithRetry: React.FC<ImageWithRetryProps> = ({ parameters, roundImage, blurDataURL, player, setLoadingImages }) => {
  const [retryCount, setRetryCount] = useState<number>(0)
  const [imageKey, setImageKey] = useState<number>(0)

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prevRetryCount => prevRetryCount + 1)
      setImageKey(prevKey => prevKey + 1)
    } else {
      console.error("Maximum retries reached. Failed to load the image.")
      setLoadingImages(prev => ({ ...prev, [player]: false }))
    }
  }

  return (
    <CldImage
      key={imageKey}
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
      blurDataURL={blurDataURL || undefined}
      className="w-full h-full object-cover rounded-lg shadow-lg"
      onLoad={() => setLoadingImages(prev => ({ ...prev, [player]: false }))}
      onError={handleRetry}
    />
  )
}

export default ImageWithRetry
