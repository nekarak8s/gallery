import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { IControls } from '@/libs/three-custom/controls'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import { MichelleBuilder } from '@/libs/three-custom/items/Player'

type ControlType = 'keypad'

type TControlStrategyProps = {
  type: ControlType
  canvasRef: React.RefObject<HTMLCanvasElement>
  sceneRef: React.RefObject<THREE.Scene>
  cameraRef: React.RefObject<DefaultCamera>
  loadingManager: THREE.LoadingManager
}

const STRATEGY_TYPE: Record<ControlType, new (...args: any[]) => IControls> = {
  keypad: KeypadControls,
}

/**
 * Choose the control strategy
 */
const useControlsStrategy = ({ type, canvasRef, sceneRef, cameraRef, loadingManager }: TControlStrategyProps) => {
  const controlsRef = useRef<IControls | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const scene = sceneRef.current
    const camera = cameraRef.current

    if (!canvas || !scene || !camera) return

    // Select the controls type
    const controlType = STRATEGY_TYPE[type]
    if (!controlType) throw new Error('Invalid contorl type')

    // Create the control
    const controls = new controlType(canvas, scene, camera, 1.6)
    controls.enabled = false
    controlsRef.current = controls

    if (controls instanceof KeypadControls) {
      MichelleBuilder.build(new GLTFLoader(loadingManager))
        .then((michelle) => {
          controls.character = michelle
        })
        .catch((err) => {
          console.error(err)
        })
    }

    return () => {
      controlsRef.current = null
      controls.dispose()
    }
  }, [type, canvasRef.current, sceneRef.current, cameraRef.current, loadingManager])

  return { controlsRef }
}

export default useControlsStrategy
