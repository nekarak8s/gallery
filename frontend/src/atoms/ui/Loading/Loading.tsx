import { useEffect, useMemo, useRef } from 'react'
import KubernetesImg from '@/assets/images/kubernetes.png'
import KubernetesSvg from '@/assets/svgs/kubernetes.svg'
import { DEVICE_BREAKPOINT } from '@/styles/responsive'
import './Loading.scss'

const WIDTH_RATIO = {
  desktop: 1,
  laptop: 0.9,
  tablet: 0.8,
  mobile: 0.7,
}
const loadingImgBitmap = await fetch(KubernetesImg)
  .then((res) => res.blob())
  .then((blob) => createImageBitmap(blob))

function Loading() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const isOffscreen = useMemo(() => {
    return 'OffscreenCanvas' in window
  }, [])

  // Draw loading animation with web worker (OffscreenCanvas)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // start web worker
    const offscreen = canvas.transferControlToOffscreen()
    const worker = new Worker(new URL('./loadingWorker.ts', import.meta.url))
    worker.postMessage({ type: 'init', canvas: offscreen, imgBitmap: loadingImgBitmap }, [offscreen])

    const handleResize = () => {
      let ratio = 1
      switch (true) {
        case window.innerWidth < DEVICE_BREAKPOINT.mobile:
          ratio = WIDTH_RATIO.mobile
          break
        case window.innerWidth < DEVICE_BREAKPOINT.tablet:
          ratio = WIDTH_RATIO.tablet
          break
        case window.innerWidth < DEVICE_BREAKPOINT.laptop:
          ratio = WIDTH_RATIO.laptop
          break
        default:
          ratio = WIDTH_RATIO.desktop
          break
      }

      const width = 4 * 16 * ratio
      worker.postMessage({ type: 'resize', width })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      worker.postMessage({ type: 'stop' })
      worker.terminate()
      window.removeEventListener('resize', handleResize)
    }
  }, [isOffscreen])

  return <div className="loading">{isOffscreen ? <canvas ref={canvasRef} /> : <KubernetesSvg />}</div>
}

export default Loading
