import React from 'react'
import GoogleLogo from '@/assets/google.svg'
import MountainImage from '@/assets/mountain.jpg'

import './Test.scss'

export default function Test() {
  return (
    <div className="flexbox">
      <img src={GoogleLogo} alt="google_logo" />
      <img src={MountainImage} alt="mountain_image" />
    </div>
  )
}
