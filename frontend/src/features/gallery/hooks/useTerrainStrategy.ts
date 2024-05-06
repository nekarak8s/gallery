import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { IGalleryStrategy } from '../utils/terrainStrategies'
import GalleryStrategy from '../utils/terrainStrategies/galleryStrategy'
import GreenaryStrategy from '../utils/terrainStrategies/greenaryStrategy'
import KyotoStrategy from '../utils/terrainStrategies/kyotoStrategy'
import { PostItemData } from '@/features/post/types'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { IControls } from '@/libs/three-custom/controls'

type TTerrainStrategyProps = {
  sceneRef: React.RefObject<THREE.Scene>
  cameraRef: React.RefObject<DefaultCamera>
  controlsRef: React.RefObject<IControls>
  loadingManager: THREE.LoadingManager
  placeId: number
  postList: PostItemData[]
}

const STRATEGY_TYPE: Record<number, new (...arg: any[]) => IGalleryStrategy> = {
  1: GreenaryStrategy,
  2: GalleryStrategy,
  3: KyotoStrategy,
}

/**
 * Choose the terrain strategy
 */
const useTerrainStrategy = ({ sceneRef, cameraRef, controlsRef, loadingManager, placeId, postList }: TTerrainStrategyProps) => {
  const terrainRef = useRef<IGalleryStrategy | null>(null)
  const [isTerrainBuilt, setIsTerrainBuilt] = useState(false)

  useEffect(() => {
    const scene = sceneRef.current
    const camera = cameraRef.current
    const controls = controlsRef.current

    if (!scene || !camera || !controls || !loadingManager || !placeId || !postList) return

    // Select the terrain type
    const terrainStrategy = STRATEGY_TYPE[placeId]
    if (!terrainStrategy) throw new Error('Invalid gallery placeId')

    // Build the terrain
    const terrain = new terrainStrategy()
    terrain
      .build({
        scene,
        camera,
        controls,
        loadingManager,
        postList,
      })
      .then(() => {
        setIsTerrainBuilt(true)
      })
      .catch((err) => {
        console.error(err)
      })

    terrainRef.current = terrain

    return () => {
      setIsTerrainBuilt(false)
      terrainRef.current = null
      terrain.dispose()
    }
  }, [sceneRef, cameraRef, controlsRef, loadingManager, placeId, postList])

  return { terrainRef, isTerrainBuilt }
}

export default useTerrainStrategy
