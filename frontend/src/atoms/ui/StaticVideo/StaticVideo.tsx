import { useRef } from 'react'

import './StaticVideo.scss'

interface StaticVideoProps {
  webmSrc: string
  vidSrc: string
  muted?: boolean
  loop?: boolean
  autoPlay?: boolean
  width?: string
  height?: string
  ariaLabel?: string
  playsInline?: boolean
  onLoad?: () => void
}

const StaticVideo = ({
  webmSrc,
  vidSrc,
  muted = true,
  loop = true,
  autoPlay = true,
  width = '100%',
  height = '100%',
  ariaLabel = '',
  playsInline = false,
  onLoad,
}: StaticVideoProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleLoad = function staticVideoLoaded() {
    const container = containerRef.current!
    container.classList.add('loaded')
    onLoad && onLoad()
  }

  return (
    <div className="static-video" ref={containerRef} style={{ width, height }}>
      <video
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        aria-label={ariaLabel}
        style={{ width, height }}
        playsInline={playsInline}
        onLoadedData={handleLoad}
      >
        <source src={webmSrc} type="video/webm" media="(min-width: 1024px)" />
        <source src={vidSrc} type="video/mp4" />
        현재 브라우저에서 비디오를 재생할 수 없습니다
      </video>
      <div />
    </div>
  )
}

export default StaticVideo
