const OceanFilter = () => {
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
          baseFrequency="0.02 0.2"
          numOctaves="4"
          seed="2"
          result="turbulence"
        >
          <animate
            attributeName="baseFrequency"
            dur="180s"
            keyTimes="0; 0.5; 1"
            values="0.02 0.2; 0.03 0.3; 0.02 0.2"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="20" />
      </filter>
    </svg>
  )
}

export default OceanFilter
