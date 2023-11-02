import React from 'react'
import imgSrc from '@/assets/images/beach.jpg?format=jpg'
import webpSrc from '@/assets/images/beach.jpg?format=webp'
import vidSrc from '@/assets/videos/ocean.mp4'
import webmSrc from '@/assets/videos/ocean.webm'
import StaticVideo from '@/atoms/ui/StaticVideo'
import LoginForm from '@/features/members/components/LoginForm'

import './Login.scss'
import StaticImage from '@/atoms/ui/StaticImage'

const Login = () => {
  return (
    <div className="login">
      <div className="login__background">
        <StaticVideo webmSrc={webmSrc} vidSrc={vidSrc} />
      </div>
      <div className="login__form">
        <StaticImage
          webpSrc={webpSrc}
          imgSrc={imgSrc}
          alt="해변가 파도"
          sizes="(max-width: 750px) 0px, (max-width: 1500px) 50vw, 750px"
        />
        <LoginForm />
      </div>
    </div>
  )
}

export default Login
