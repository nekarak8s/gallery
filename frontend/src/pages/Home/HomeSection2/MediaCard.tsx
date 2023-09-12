import React from 'react'

import styles from './MediaCard.module.scss'

interface Props {
  description: string
  year: string
  month: string
  date: string
}

const MediaCard: React.FC<PropsWithChildren<Props>> = ({
  children,
  description,
  year,
  month,
  date,
}) => {
  return (
    <div className={styles.mediaCard}>
      {children}
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
