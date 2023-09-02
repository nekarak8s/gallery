import React from 'react'
import HomeSection1 from './HomeSection1'
import HomeSection2 from './HomeSection2'
import HomeSection3 from './HomeSection3'

import './Home.scss'

function Home() {
  return (
    <div className="home">
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
    </div>
  )
}

export default Home
