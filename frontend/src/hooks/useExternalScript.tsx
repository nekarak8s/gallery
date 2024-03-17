import { useEffect, useState } from 'react'

export const useExternalScript = (url: string) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    let script = document.querySelector(
      `script[src="${url}"]`
    ) as HTMLScriptElement

    const handleScript = (e: Event) => {
      if (e.type === 'load') {
        setIsLoading(false)
        setIsSuccess(true)
      } else {
        setIsLoading(false)
        setIsError(true)
      }
    }

    if (!script) {
      script = document.createElement('script')
      script.type = 'application/javascript'
      script.src = url
      script.async = true
      document.body.appendChild(script)
    }

    script.addEventListener('load', handleScript)
    script.addEventListener('error', handleScript)

    return () => {
      script && script.removeEventListener('load', handleScript)
      script && script.removeEventListener('error', handleScript)
    }
  }, [url])

  return { isLoading, isError, isSuccess }
}
