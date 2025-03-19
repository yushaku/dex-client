import { useEffect, useRef } from 'react'

export const useInputFocus = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef])

  return inputRef
}
