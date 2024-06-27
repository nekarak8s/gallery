import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { IControls } from '@/libs/three-custom/controls'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import MouseControls from '@/libs/three-custom/controls/MouseControls'

export type TControlType = 'keypad' | 'mouse'

type TControlStrategyProps = {
  type: TControlType
  canvasRef: React.RefObject<HTMLCanvasElement>
  sceneRef: React.RefObject<THREE.Scene>
  cameraRef: React.RefObject<DefaultCamera>
  isDefaultRenderReady: boolean
  loadingManager: THREE.LoadingManager
}

const STRATEGY_TYPE: Record<TControlType, new (...args: any[]) => IControls> = {
  keypad: KeypadControls,
  mouse: MouseControls,
}

/**
 * Choose the control strategy
 */
const useControlsStrategy = ({ type, canvasRef, sceneRef, cameraRef, isDefaultRenderReady, loadingManager }: TControlStrategyProps) => {
  const [isControlReady, setIsControlReady] = useState(false)
  const controlsRef = useRef<IControls | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current

    if (!isDefaultRenderReady || !canvas || !scene || !camera || !loadingManager) return

    // Select the controls type
    const controlType = STRATEGY_TYPE[type]
    if (!controlType) throw new Error('Invalid control type')

    // Create the control
    const controls = new controlType({ canvas, scene, camera })
    controls.enabled = false
    controlsRef.current = controls

    setIsControlReady(true)

    return () => {
      controlsRef.current = null
      controls.dispose()

      setIsControlReady(false)
    }
  }, [type, isDefaultRenderReady, loadingManager])

  return { controlsRef, isControlReady }
}

export default useControlsStrategy
