import React from 'react'
import responsiveImage from '@/assets/images/home-section-2/narrow-1.jpg?format=jpg'
import responsiveImageWebp from '@/assets/images/home-section-2/narrow-1.jpg?format=webp'
import vidSrc from '@/assets/videos/home-video-1.mp4'
import webmSrc from '@/assets/videos/home-video-1.webm'
import StaticImage from '@/atoms/ui/StaticImage'
import StaticVideo from '@/atoms/ui/StaticVideo'
import { useCreateArtwork } from '@/features/gallery/services'
import './Guide.scss'

function Guide() {
  const { mutate: create, isLoading, isSuccess, isError } = useCreateArtwork()

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // validate data
    const formData = new FormData(e.currentTarget)

    create(formData)
  }

  return (
    <div className="guide">
      <form onSubmit={handleSubmit}>
        <input type="text" name="posts[0].title" />
        <textarea name="posts[0].content" />
        <input type="file" name="posts[0].file" accept="image/*" />
        <input type="text" name="posts[1].title" />
        <textarea name="posts[1].content" />
        <input type="file" name="posts[1].file" accept="image/*" />
        <button type="submit">제출</button>
      </form>
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
