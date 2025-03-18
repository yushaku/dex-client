import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      // Return early if there's no window (e.g., in SSR) or matchMedia support
      return
    }

    const mediaQueryList = window.matchMedia(query)

    const onChange = (event: MediaQueryListEvent) => {
      setValue(event.matches)
    }

    // Set the initial value based on the query match
    setValue(mediaQueryList.matches)

    // Add the appropriate event listener
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', onChange)
    } else {
      // Fallback for older browsers
      mediaQueryList.addListener(onChange)
    }

    return () => {
      // Remove the event listener on cleanup
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', onChange)
      } else {
        mediaQueryList.removeListener(onChange)
      }
    }
  }, [query])

  return value
}
