import React from 'react'
import responsiveImage from '@/assets/images/home-section-2/narrow-1.jpg?format=jpg'
import responsiveImageWebp from '@/assets/images/home-section-2/narrow-1.jpg?format=webp'
import vidSrc from '@/assets/videos/home-video-1.mp4'
import webmSrc from '@/assets/videos/home-video-1.webm'
import StaticImage from '@/atoms/ui/StaticImage'
import StaticVideo from '@/atoms/ui/StaticVideo'
import './Guide.scss'

function Guide() {
  return (
    <div className="guide">
      <p>정적 이미지 / 비디오 로딩 테스트</p>
      <div className="guide__media">
        <StaticImage
          webpSrc={responsiveImageWebp}
          imgSrc={responsiveImage}
          alt="푸른 하늘"
          width={'40vw'}
          height={'30vw'}
        />
        <StaticVideo webmSrc={webmSrc} vidSrc={vidSrc} width={'40vw'} height={'30vw'} />
      </div>
    </div>
  )
}

export default Guide
