import { useMemo, useState } from 'react'
import * as THREE from 'three'
import toastManager from '@/utils/toastManager'

/**
 * loadingManger that counts the required and loaded resources
 */
const useLoadingCount = () => {
  const [requiredCount, setRequiredCount] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)

  const loadingManager = useMemo(() => {
    const loadingManager = new THREE.LoadingManager()

    loadingManager.onStart = function increaseLoadCount() {
      setRequiredCount((cnt) => cnt + 1)
    }
    loadingManager.onLoad = function decreaseLoadCount() {
      setLoadedCount((cnt) => cnt + 1)
    }
    loadingManager.onError = function toastLoadingErrorMesage(url) {
      console.error(url)
      toastManager.addToast('error', '필요한 자원을 로드하지 못했습니다')
    }

    return loadingManager
  }, [])

  return { loadingManager, requiredCount, loadedCount, setRequiredCount, setLoadedCount }
}

export default useLoadingCount
