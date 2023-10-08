import React from 'react'

import styles from './OceanFiltered.module.scss'

const OceanFiltered: React.FC = () => {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 220 220"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="ocean-filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          id="turbulence"
          baseFrequency="0.01 0.1"
          numOctaves="4"
          seed="2"
          result="turbulence"
        >
          <animate
            attributeName="baseFrequency"
            dur="180s"
            keyTimes="0;0.5;1"
            values="0.012 0.15; 0.014 0.2; 0.012 0.15"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="20" />
      </filter>
    </svg>
  )
}

export default OceanFiltered
