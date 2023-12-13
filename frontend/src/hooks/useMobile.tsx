import { useEffect, useState } from 'react'

/**
 * Check whether the code is running on the mobile device on 'resize'event
 * @returns result
 */
function useMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = function checkMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}

export default useMobile
