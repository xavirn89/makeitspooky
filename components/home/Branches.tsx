// @/components/home/Branches
"use client"

import React from 'react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const Branches = () => {

  const [isFirstVisit, setIsFirstVisit] = useState(false)

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited')
    if (!hasVisited) {
      setIsFirstVisit(true)
      localStorage.setItem('hasVisited', 'true')
    }
  }, [])

  return (
    <>
      {isFirstVisit && (
        <>
          <Image
            src="/tools/branch1.png"
            alt="Branch 1"
            width={1400}
            height={1000}
            className="absolute -right-56 transform z-50 animate-slideOutRight_0delay"
          />
          <Image
            src="/tools/branch2.png"
            alt="Branch 2"
            width={1400}
            height={1000}
            className="absolute -left-1/4 top-20 transform z-50 animate-slideOutLeft_05delay"
          />
          <Image
            src="/tools/branch3.png"
            alt="Branch 3"
            width={1400}
            height={1000}
            className="absolute -right-56 transform z-50 animate-slideOutRight_05delay"
          />
          <Image
            src="/tools/branch4.png"
            alt="Branch 4"
            width={1400}
            height={1000}
            className="absolute -left-56 -bottom-5 transform z-50 animate-slideOutLeft_1delay"
          />
        </>
      )}
    </>
  )
}

export default Branches