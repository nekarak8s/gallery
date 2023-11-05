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
  'data:image/jpeg;base64,/9j/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAbABQDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAQIBQYH/8QAKxAAAQMDBAEDAgcAAAAAAAAAAQIDBAUGEQAHEiExCBMiFEEVMlFhcYGR/8QAFwEAAwEAAAAAAAAAAAAAAAAAAwUGBP/EACcRAAIBAgQEBwAAAAAAAAAAAAECAwARBAUSMRUhgZETFEFCUZLh/9oADAMBAAIRAxEAPwB6/fUxD3BNCkMoMFdGqKJqlxJyyhxriUpVgBJBBJH3wCe+zpHdD1FQbzeiMQGXVORZscvEge3lQVx4K6Oe+gOsns66m/tnNt9vqBDuZLiqtFfkoee+jICpbPI/FK0kA4z158ec96iv1ky6Fbu64TZ6W49Fm06NIDyUu8l+RhwuKPyBGMpwMBONE4mZS8cMgJG9KuGSpokZbX2qvrJ9R7Nv06Y0chb0x11SpISpxZzx5KISrJ+P3wf2xjRqUdp5N5XjaLchMhEhuO6qOh2alSlqGAvIJPY+fn+dGshzPEISoI+tBbByBiCR3/asiymKVvNaEC3p1chgUmQ42qmRklMteCTjkTx4YPXAE4x401V7C232zvWl1KVR4tUrSYajHDyA8GQFEDIVlAUPHIjl3/etWxorCa27EEdkRnIMZ9bXtJ4qX7j4yRjvoD/B+msL1Vn8Mp9lPxEpjul6UxltISPb4Nq448fmAOksWX+HimxCPZW9oFuZ+SN+t7VX+c1wLAy3I9Tz7A7dK9/t3cVl2kR1+43FBSOLTaAABjRqMKhcdTaRESia6gewk4Bx9zo1ZLLGoA00haGQknVX/9k='

const StaticImage: React.FC<Props> = ({
  webpSrc,
  imgSrc,
  alt,
  width = '100%',
  height = '100%',
  sizes = '(max-width: 1200px) 100vw, 1201px',
  loading = 'lazy',
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
