import React, { useRef } from 'react'
import './StaticImage.scss'

interface Props {
  webpSrc: ResponsiveImageOutput
  imgSrc: ResponsiveImageOutput
  alt: string
  sizes?: string
  onLoad?: () => void
}

const DEV_BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAANCAMAAACejr5sAAAALVBMVEW2xtKarMySpcp2i7+htM6EmcWnuc+Ln8iwwdF+k8KsvdBuhLpdcqhnfLJQZZpFETrMAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAWElEQVR4nGXMWw7AIAwDQUOA8Oz9j4uSIkiLP0crI8ZSiIhaG6P3/sjAHC+H9yxe1NvrcM6Lf3KE4C5HSmH5uUGu9XIgKyfLgPAvF1S3+cLtmh80NxZ3PgFniQVN6XSF5wAAAABJRU5ErkJggg=='

const StaticImage: React.FC<Props> = ({
  webpSrc,
  imgSrc,
  alt,
  sizes = '(max-width: 1200px) 100vw, 1201px',
  onLoad,
}) => {
  const picRef = useRef<HTMLPictureElement>(null)

  const handleImageLoad = function addLoadedClass() {
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
          'url("' + imgSrc.placeholder
            ? imgSrc.placeholder
            : DEV_BLUR_DATA + '")',
      }}
    >
      <source srcSet={webpSrc.srcSet} type="image/webp" sizes={sizes} />
      <img
        alt={alt}
        src={imgSrc.src}
        srcSet={imgSrc.srcSet}
        sizes={sizes}
        loading="lazy"
        onLoad={handleImageLoad}
      />
    </picture>
  )
}

export default StaticImage
