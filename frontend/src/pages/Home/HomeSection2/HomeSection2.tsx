import React, { useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import imgSrc3 from '@/assets/images/home-section-2/clouds-poster.webp'
import imgSrc1 from '@/assets/images/home-section-2/dog-drawing.webp'
import imgSrc2 from '@/assets/images/home-section-2/jazz.webp'
import vidSrc1 from '@/assets/videos/video1.webm'
import vidSrc2 from '@/assets/videos/video2.webm'

import MediaCard from './MediaCard'
import styles from './HomeSection2.module.scss'

const BACKGROUND_HEIGHT = 600 // vh
const SCROLL_OFFSET = 200 // offset for handlescroll

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
      media.children as HTMLCollectionOf<HTMLElement>
    )

    background.style.setProperty(
      '--background-height',
      `${BACKGROUND_HEIGHT}vh`
    )

    // initiate data on Resize
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData2() {
      // initiate scroll data
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight

      // initiate media card position
      mediaEles.forEach((el) => {
        const posx = Number(el.dataset.posx)
        const posy = Number(el.dataset.posy)
        el.style.left = `${100 * posx}vw`
        el.style.top = `${100 * posy}vh`
      })
    }

    const handleScroll = function setElementsPosition2() {
      const scrollTop = window.scrollY

      // optimization
      if (scrollTop < scrollStart - SCROLL_OFFSET || scrollTop > scrollEnd)
        return

      // toggle phrase opacity
      if (scrollTop > scrollStart) {
        phrase.classList.add(styles.visible)
      } else {
        phrase.classList.remove(styles.visible)
      }

      // scroll up media files
      const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)
      mediaEles.forEach((el) => {
        const speedy = Number(el.dataset.speedy)
        el.style.transform = `translateY(
          -${factor * (BACKGROUND_HEIGHT - 100) * speedy}vh
          )`

        const mediaCard = el.querySelector(
          `.${styles.mediaItemCard}`
        ) as HTMLDivElement
        if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
          mediaCard.classList.add(styles.open)
        }
      })
    }

    init()

    // throttle the functions
    const throttledHandleScroll = throttle(handleScroll, 10)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', throttledHandleScroll)
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [])

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.main} ref={mainRef}>
        <div className={styles.phrase} ref={phraseRef}>
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
        <div className={styles.media} ref={mediaRef}>
          <div
            className={styles.mediaItem}
            data-posx="0.1"
            data-posy="1.2"
            data-speedy="0.7"
            style={{ zIndex: 3, width: '40vw', height: '30vw' }}
          >
            <div className={styles.mediaItemCard}>
              <MediaCard
                description="My Wondeful Daily Life"
                year="2019"
                month="10"
                date="21"
              >
                <video
                  src={vidSrc1}
                  autoPlay
                  muted
                  loop
                  className={styles.mediaItemCardSrc}
                />
              </MediaCard>
            </div>
          </div>
          <div
            className={styles.mediaItem}
            data-posx="0.6"
            data-posy="2.7"
            data-speedy="1.4"
            style={{ zIndex: 5, width: '30vw', height: '45vw' }}
          >
            <div className={styles.mediaItemCard}>
              <MediaCard
                description="The Dog Poster"
                year="2021"
                month="6"
                date="13"
              >
                <img src={imgSrc1} className={styles.mediaItemCardSrc} />
              </MediaCard>
            </div>
          </div>

          <div
            className={styles.mediaItem}
            data-posx="0.05"
            data-posy="4.6"
            data-speedy="1.6"
            style={{ zIndex: 5, width: '40vw', height: '40vw' }}
          >
            <div className={styles.mediaItemCard}>
              <MediaCard
                description="Blue Night Jazz Club"
                year="2018"
                month="2"
                date="16"
              >
                <img src={imgSrc2} className={styles.mediaItemCardSrc} />
              </MediaCard>
            </div>
          </div>
          <div
            className={styles.mediaItem}
            data-posx="0.5"
            data-posy="2.3"
            data-speedy="0.8"
            style={{ zIndex: 1, width: '40vw', height: '30vw' }}
          >
            <div className={styles.mediaItemCard}>
              <MediaCard
                description="My Wondeful Daily Life"
                year="2019"
                month="10"
                date="21"
              >
                <video
                  src={vidSrc2}
                  autoPlay
                  muted
                  loop
                  className={styles.mediaItemCardSrc}
                />
              </MediaCard>
            </div>
          </div>
          <div
            className={styles.mediaItem}
            data-posx="0.05"
            data-posy="5"
            data-speedy="1"
            style={{ zIndex: 7 }}
          >
            <div
              className={styles.mediaItemCardContainer}
              style={{ width: '95vw' }}
            >
              <div
                className={styles.mediaItemCard}
                style={{ width: '50vh', height: '80vh' }}
              >
                <MediaCard
                  description="My Wondeful Daily Life"
                  year="2019"
                  month="10"
                  date="21"
                >
                  <img src={imgSrc3} className={styles.mediaItemCardSrc} />
                </MediaCard>
              </div>
              <div className={styles.mediaItemCardBlank}>
                <p>
                  <span>T</span>he advancement of mobile devices has made it
                  easy to take photos, but it has also brought along a certain
                  issue. Today, each individual photograph seems to have lost
                  its intrinsic meaning. We now look at photos not as records of
                  moments but as material for sharing on social media or mere
                  fragments of memories.
                </p>
                <p>
                  <span>H</span>owever, what we often overlook is that
                  photographs capture moments from the past, each carrying its
                  own emotions and significance. Some photos can remind us of
                  significant moments in our lives and evoke deeper thoughts and
                  emotions. Therefore, when taking photos with mobile devices,
                  we should consider not only the beauty of the moment but also
                  what that moment signifies.
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
