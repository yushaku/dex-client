import { useEffect, useState } from 'react'

export const useWindowWidth = (): number => {
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    handleResize() // Set initial width

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return width
}

export const useWindowHeight = (): number => {
  const [height, setHeight] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight)
    }

    handleResize() // Set initial height

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return height
}
