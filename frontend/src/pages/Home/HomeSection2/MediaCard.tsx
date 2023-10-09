import React from 'react'
import './MediaCard.scss'
import StaticImage from '@/atoms/ui/StaticImage'
import StaticVideo from '@/atoms/ui/StaticVideo'

interface Props {
  type?: 'image' | 'video'
  imgSrc?: ResponsiveImageOutput
  webpSrc?: ResponsiveImageOutput
  vidSrc?: string
  webmSrc?: string
  alt: string
  width: string
  height: string
  description: string
  date: string
  sizes?: string
}

const MediaCard: React.FC<Props> = ({
  type = 'image',
  imgSrc,
  webpSrc,
  vidSrc,
  webmSrc,
  alt,
  width,
  height,
  description,
  date,
  sizes,
}) => {
  return (
    <div className="media-card">
      {type == 'image' ? (
        <StaticImage
          webpSrc={webpSrc!}
          imgSrc={imgSrc!}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
        />
      ) : (
        <StaticVideo
          webmSrc={webmSrc!}
          vidSrc={vidSrc!}
          ariaLabel={alt}
          width={width}
          height={height}
        />
      )}

      <div className="media-card__label">
        <p>{description}</p>
        <p>{date}</p>
      </div>
    </div>
  )
}

export default MediaCard