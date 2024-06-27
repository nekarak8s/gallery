import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { DefaultCamera } from '@/libs/three-custom/cameras/DefaultCamera'
import { DefaultRenderer } from '@/libs/three-custom/renderers/DefaultRenderer'
import { disposeObject } from '@/libs/three-custom/utils/disposeObject'

type TDefaultRenderProps = {
  canvasRef: React.RefObject<HTMLCanvasElement>
}

/**
 * Set Default render data
 */
const useDefaultRender = ({ canvasRef }: TDefaultRenderProps) => {
  const [isDefaultRenderReady, setIsDefaultRender] = useState(false)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<DefaultCamera | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const renderer = new DefaultRenderer({ canvas, antialias: true })
    rendererRef.current = renderer

    const camera = new DefaultCamera({ canvas })
    cameraRef.current = camera
    scene.add(camera)

    // Add event listener for resizing
    const handleSize = function resizeCameraRenderer() {
      camera.setDefaultAspect()
      camera.updateProjectionMatrix()
      renderer.setDefaultSize()
      renderer.render(scene, camera)
    }
    window.addEventListener('resize', handleSize)

    setIsDefaultRender(true)

    // Dispose the resources
    return () => {
      sceneRef.current = null
      rendererRef.current = null
      cameraRef.current = null

      scene.remove(camera)
      disposeObject(scene)

      renderer.getRenderTarget()?.dispose()
      renderer.dispose()
      window.removeEventListener('resize', handleSize)

      setIsDefaultRender(false)
    }
  }, [])

  return { sceneRef, rendererRef, cameraRef, isDefaultRenderReady }
}

export default useDefaultRender
