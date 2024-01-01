import { useState, useEffect } from 'react'

type UseDebounceHook<T> = (value: T, delay?: number) => T

const useDebounce: UseDebounceHook<string> = (value, delay = 200) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
