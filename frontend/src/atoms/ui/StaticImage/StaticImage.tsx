import React, { useRef } from 'react'
import './StaticImage.scss'

interface Props {
  webpSrc: ResponsiveImageOutput
  imgSrc: ResponsiveImageOutput
  alt: string
  width?: string
  height?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  onLoad?: () => void
}

const DEV_BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAMAAACejr5sAAAALVBMVEW2xtKarMySpcp2i7+htM6EmcWnuc+Ln8iwwdF+k8KsvdBuhLpdcqhnfLJQZZpFETrMAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAWElEQVR4nGXMWw7AIAwDQUOA8Oz9j4uSIkiLP0crI8ZSiIhaG6P3/sjAHC+H9yxe1NvrcM6Lf3KE4C5HSmH5uUGu9XIgKyfLgPAvF1S3+cLtmh80NxZ3PgFniQVN6XSF5wAAAABJRU5ErkJggg=='

const StaticImage: React.FC<Props> = ({
  webpSrc,
  imgSrc,
  alt,
  width = '100%',
  height = '100%',
  sizes = '(max-width: 1200px) 100vw, 1201px',
  loading = 'eager',
  onLoad,
}) => {
  const picRef = useRef<HTMLPictureElement>(null)

  const handleLoad = function staticImageLoaded() {
    const picture = picRef.current!
    picture.classList.add('loaded')
    onLoad && onLoad()
  }
  return (
    <picture
      ref={picRef}
      className="static-image"
      style={{
        backgroundImage:
          'url("' +
          (imgSrc.placeholder ? imgSrc.placeholder : DEV_BLUR_DATA) +
          '")',
      }}
    >
      <source srcSet={webpSrc.srcSet} type="image/webp" sizes={sizes} />
      <img
        alt={alt}
        src={imgSrc.src}
        srcSet={imgSrc.srcSet}
        sizes={sizes}
        loading={loading}
        onLoad={handleLoad}
        style={{ width, height }}
      />
    </picture>
  )
}

export default StaticImage
