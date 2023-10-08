import React from 'react'

import './Guide.scss'
import responsiveImage from '@/assets/images/gallery/3d.png?format=png'
import responsiveImageWebp from '@/assets/images/gallery/3d.png?format=webp'
import StaticImage from '@/atoms/ui/StaticImage'

function Guide() {
  return (
    <div className="guide">
      <div className="guide__image">
        <StaticImage
          webpSrc={responsiveImageWebp}
          imgSrc={responsiveImage}
          alt="푸른 하늘"
        />
      </div>
      <p>아직 개발 중입니다</p>
    </div>
  )
}

export default Guide
