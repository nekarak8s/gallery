import React from 'react'

import styles from './OceanFiltered.module.scss'

interface Props {
  imgSrc: string
}

const OceanFiltered: React.FC<Props> = ({ imgSrc }) => {
  console.log(styles)
  return (
    <>
      <img className={styles.targetImg} src={imgSrc} />
      <svg
        width="200"
        height="200"
        viewBox="0 0 220 220"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svgMask}
      >
        <filter id="turbulence" x="0" y="0" width="100%" height="100%">
          <feTurbulence
            id="sea-filter"
            baseFrequency="0.01 0.1"
            numOctaves="4"
            seed="2"
            result="turbulence"
          />
          <feDisplacementMap in="SourceGraphic" scale="20" />
          <animate
            xlinkHref="#sea-filter"
            attributeName="baseFrequency"
            dur="180s"
            keyTimes="0;0.5;1"
            values="0.012 0.15; 0.014 0.2; 0.012 0.15"
            repeatCount="indefinite"
          />
        </filter>
      </svg>
    </>
  )
}

export default OceanFiltered
