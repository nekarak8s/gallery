import React from 'react'
import GoogleLogo from './assets/google.svg'
import MountainImage from './assets/mountain.jpg'

import './App.scss'

function App() {
  return (
    <div>
      <h1>리액트!</h1>
      <div className="flexbox">
        <img src={GoogleLogo} alt="google_logo" />
        <img src={MountainImage} alt="mountain_image" />
      </div>
    </div>
  )
}
export default App
