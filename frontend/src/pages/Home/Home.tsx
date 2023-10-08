import React, { useEffect, useRef } from 'react'
import { getRandom } from '@/utils/math'
import HomeSection1 from './HomeSection1'
import HomeSection2 from './HomeSection2'
import HomeSection3 from './HomeSection3'
import bgm from '@/assets/audio/MapleStory-Lith-Harbor.mp3'

import './Home.scss'
import Music from '@/atoms/ui/Music'

const BACKGROUND_COLORS = ['#CDF4F5', '#1B9CC6', '#016699'] // '#87D7D0'
const FONT_COLORS = ['#F74F48', '#F7A754', '#F7B5B7'] // '#FA937A'

function Home() {
  const pageRef = useRef<HTMLDivElement>(null)

  const handleClick = function setRandomBgFontColors() {
    const page = pageRef.current as HTMLDivElement

    const index = getRandom(0, BACKGROUND_COLORS.length - 1)

    page.style.setProperty('--background-color', BACKGROUND_COLORS[index])
    page.style.setProperty('--font-color', FONT_COLORS[index])
  }

  useEffect(() => {
    handleClick()
  }, [])

  return (
    <div className="home" ref={pageRef} onClick={handleClick}>
      <HomeSection1 />
      <HomeSection2 />
      <HomeSection3 />
      <div className="home__music">
        <Music
          id="home-audio"
          src={bgm}
          title="MapleStory - Lith Harbor (ver.Piano)"
          color="white"
        />
      </div>
    </div>
  )
}

export default Home
