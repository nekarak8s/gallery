import React, { useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import imgSrc3 from '@/assets/images/home-section-2/clouds-poster.webp'
import imgSrc1 from '@/assets/images/home-section-2/dog-drawing.webp'
import imgSrc2 from '@/assets/images/home-section-2/jazz.webp'
import vidSrc1 from '@/assets/videos/video1.webm'
import vidSrc2 from '@/assets/videos/video2.webm'

import MediaCard from './MediaCard'
import styles from './HomeSection2.module.scss'

const BACKGROUND_HEIGHT = 800 // vh

function HomeSection2() {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current as HTMLDivElement
    const main = mainRef.current as HTMLDivElement
    const phrase = phraseRef.current as HTMLDivElement
    const media = mediaRef.current as HTMLDivElement
    const mediaEles = Array.from(
      media.children as HTMLCollectionOf<HTMLDivElement>
    )

    // Set the background hieght
    background.style.setProperty(
      '--background-height',
      `${BACKGROUND_HEIGHT}vh`
    )

    // Initiate data
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData2() {
      // Initiate scroll data
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight

      // Initiate abosolute position
      mediaEles.forEach((el) => {
        const posx = Number(el.dataset.posx)
        const posy = Number(el.dataset.posy)
        if (posx > 0) {
          el.style.left = `${100 * posx}vw`
        } else {
          el.style.right = `${100 * -posx}vw`
        }

        el.style.top = `${100 * posy}vh`
      })
    }

    // Move media elements according to scrool
    const handleScroll = function setElementsPosition2() {
      const scrollTop = window.scrollY

      if (scrollTop < scrollStart || scrollTop > scrollEnd) return

      // Toggle phrase opacity
      if (scrollTop > scrollStart) {
        phrase.classList.add(styles.visible)
      } else {
        phrase.classList.remove(styles.visible)
      }

      // Move media elements
      const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)
      mediaEles.forEach((el) => {
        const speedy = Number(el.dataset.speedy)
        el.style.transform = `translateY(
          calc(-50% - ${factor * (BACKGROUND_HEIGHT - 100) * speedy}vh)
          )`

        // open the card
        const mediaCard = el.firstElementChild as HTMLDivElement
        if (mediaCard.getBoundingClientRect().top < window.innerHeight * 0.9) {
          mediaCard.classList.add(styles.open)
        }
      })
    }

    init()

    // throttle the functions
    const throttledHandleScroll = throttle(handleScroll, 10)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.main} ref={mainRef}>
        <div className={styles.mainPhrase} ref={phraseRef}>
          <p data-speedy="0" style={{ zIndex: 4 }}>
            하루에 몇 장의 사진을 찍고
          </p>
          <p data-speedy="0" style={{ zIndex: 2 }}>
            하루에 몇 장을 기억에 담고
          </p>
          <p data-speedy="0" style={{ zIndex: 6 }}>
            하루에 몇 번을 공유 하나요
          </p>
        </div>
        <div className={styles.mainMedia} ref={mediaRef}>
          <div
            className={styles.mainMediaItem}
            data-posx="0.1"
            data-posy="1.5"
            data-speedy="0.7"
            style={{ zIndex: 3 }}
          >
            <div className={styles.mainMediaItemCard}>
              <MediaCard
                type="video"
                alt="daily life clips"
                src={vidSrc1}
                width="clamp(230px, 40vw, 500px)"
                height="clamp(172px, 30vw, 375px)"
                description="My Wondeful Daily Life"
                year="2019"
                month="10"
                date="21"
              />
            </div>
          </div>
          <div
            className={styles.mainMediaItem}
            data-posx="-0.1"
            data-posy="4.3"
            data-speedy="1.4"
            style={{ zIndex: 5 }}
          >
            <div className={styles.mainMediaItemCard}>
              <MediaCard
                alt="dog poster"
                src={imgSrc1}
                width="clamp(200px, 30vw, 500px)"
                height="clamp(300px, 45vw, 750px)"
                description="The Dog Poster"
                year="2021"
                month="6"
                date="13"
              />
            </div>
          </div>
          <div
            className={styles.mainMediaItem}
            data-posx="0.05"
            data-posy="6"
            data-speedy="1.5"
            style={{ zIndex: 5 }}
          >
            <div className={styles.mainMediaItemCard}>
              <MediaCard
                alt="Womman singing in the jazz bar"
                src={imgSrc2}
                width="clamp(250px, 30vw, 600px)"
                height="clamp(250px, 30vw, 600px)"
                description="Blue Night Jazz Club"
                year="2018"
                month="2"
                date="16"
              />
            </div>
          </div>
          <div
            className={styles.mainMediaItem}
            data-posx="-0.15"
            data-posy="5"
            data-speedy="0.8"
            style={{ zIndex: 1 }}
          >
            <div className={styles.mainMediaItemCard}>
              <MediaCard
                type="video"
                alt="travling video cllips"
                src={vidSrc2}
                width="clamp(230px, 40vw, 500px)"
                height="clamp(172px, 30vw, 375px)"
                description="My Wondeful Daily Life"
                year="2019"
                month="10"
                date="21"
              />
            </div>
          </div>
          <div
            className={styles.mainMediaItem}
            data-posx="0.05"
            data-posy="7.5"
            data-speedy="1"
            style={{ zIndex: 7 }}
          >
            <div className={styles.mainMediaItemCard} style={{ width: '95vw' }}>
              <MediaCard
                alt="The cloud poster"
                src={imgSrc3}
                width="clamp(190px, 50vw, 350px)"
                height="clamp(304px, 70vw, 490px)"
                description="The cloud poster"
                year="2019"
                month="10"
                date="21"
              />
              <div className={styles.mediaItemCardBlank}>
                <p>
                  <span>T</span>he advancement of mobile devices has made it
                  easy to take photos, but it has also brought along a certain
                  issue. Today, each individual photograph seems to have lost
                  its intrinsic meaning. We now look at photos not as records of
                  moments but as material for sharing on social media or mere
                  fragments of memories.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection2
