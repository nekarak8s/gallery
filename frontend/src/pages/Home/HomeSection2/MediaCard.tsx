import React from 'react'
import styles from './MediaCard.module.scss'

interface Props {
  type?: 'image' | 'video'
  src: string
  alt: string
  width: string
  height: string
  description: string
  year: string
  month: string
  date: string
}

const MediaCard: React.FC<Props> = ({
  type = 'image',
  src,
  alt,
  width,
  height,
  description,
  year,
  month,
  date,
}) => {
  return (
    <div className={styles.mediaCard}>
      {type == 'image' ? (
        <img
          className={styles.mediaCardSrc}
          src={src}
          alt={alt}
          style={{ width, height }}
          loading="lazy"
        />
      ) : (
        <video
          className={styles.mediaCardSrc}
          muted
          autoPlay
          loop
          src={src}
          style={{ width, height }}
        />
      )}

      <div className={styles.mediaCardLabel}>
        <p>{description}</p>
        <p>
          {year}.{month}.{date}
        </p>
      </div>
    </div>
  )
}

export default MediaCard
