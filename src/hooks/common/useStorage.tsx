import { useCallback, useState } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const storageObject =
    typeof window !== 'undefined' ? window.localStorage : null
  return useStorage<T>(key, defaultValue, storageObject)
}

export function useSessionStorage<T>(key: string, defaultValue: T) {
  const storageObject =
    typeof window !== 'undefined' ? window.sessionStorage : null
  return useStorage<T>(key, defaultValue, storageObject)
}

function useStorage<T>(
  key: string,
  defaultValue: T,
  storageObject: Storage | null
) {
  const [value, setValue] = useState<T>(() => {
    if (storageObject) {
      const jsonValue = storageObject.getItem(key)
      if (jsonValue != null) return JSON.parse(jsonValue)
    }

    if (typeof defaultValue === 'function') {
      return defaultValue()
    } else {
      return defaultValue
    }
  })

  // useEffect(() => {
  //   if (storageObject) {
  //     if (value === undefined) return storageObject.removeItem(key)
  //     storageObject.setItem(key, JSON.stringify(value))
  //   }
  // }, [key, value, storageObject])

  const set = useCallback(
    (data: T) => {
      if (storageObject) {
        setValue(data)
        storageObject.setItem(key, JSON.stringify(value))
      }
    },
    [key, storageObject, value]
  )

  const clear = useCallback(() => {
    setValue(undefined as unknown as T)
    storageObject?.removeItem(key)
  }, [key, storageObject])

  return [value, set, clear]
}
