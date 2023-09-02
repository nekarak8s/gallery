import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'

import imgSrc0 from '@/assets/images/home-section-2/unsplash-0.jpg'
import imgSrc1 from '@/assets/images/home-section-2/unsplash-1.jpg'
import imgSrc2 from '@/assets/images/home-section-2/unsplash-2.jpg'
import imgSrc3 from '@/assets/images/home-section-2/unsplash-3.jpg'
import imgSrc4 from '@/assets/images/home-section-2/unsplash-4.jpg'
import vidSrc0 from '@/assets/videos/example.webm'

import styles from './HomeSection2.module.scss'

function HomeSection2() {
  // element refs
  const backgroundRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLDivElement>(null)
  const videosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // get the elements
    const background = backgroundRef.current as HTMLDivElement
    const main = mainRef.current as HTMLDivElement
    const phrase = phraseRef.current as HTMLDivElement
    const videos = videosRef.current as HTMLDivElement

    const videoEles = Array.from(
      videos.children as HTMLCollectionOf<HTMLElement>
    )

    // init the data
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData2() {
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight

      videoEles.forEach((el) => {
        const posx = Number(el.dataset.posx)
        const posy = Number(el.dataset.posy)
        el.style.left = `${30 * posx}vw`
        el.style.top = `-${100 * posy}vh`
      })
    }

    const handleScroll = function setElementsPosition2() {
      const scrollTop = window.scrollY

      if (scrollTop < scrollStart || scrollTop > scrollEnd) return

      if (scrollTop > scrollStart) {
        phrase.classList.add(styles.visible)
      } else {
        phrase.classList.remove(styles.visible)
      }

      console.log(2)

      const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)

      videoEles.forEach((el) => {
        const speedy = Number(el.dataset.speedy)
        el.style.transform = `translateY(${(1 - factor) * 300 * speedy}vh)`

        const video = el.querySelector('video') as HTMLVideoElement
        if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
          video.classList.add(styles.open)
        } else {
          video.classList.remove(styles.open)
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
            ABCDABCDAABCD
          </p>
          <p data-speedy="0" style={{ zIndex: 2 }}>
            ABCDABCDAABCD
          </p>
          <p data-speedy="0" style={{ zIndex: 6 }}>
            ABCDABCDAABCD
          </p>
        </div>
        <div className={styles.videos} ref={videosRef}>
          <div
            data-posx="0.3"
            data-posy="2"
            data-speedy="0.9"
            style={{ zIndex: 3, width: '40vw', height: '30vw' }}
          >
            <video src={vidSrc0} autoPlay muted loop className={styles.video} />
          </div>
          <div
            data-posx="2.2"
            data-posy="1"
            data-speedy="0.8"
            style={{ zIndex: 5, width: '20vw', height: '40vw' }}
          >
            <video src={vidSrc0} autoPlay muted loop className={styles.video} />
          </div>
          <div
            data-posx="0.1"
            data-posy="0"
            data-speedy="1.1"
            style={{ zIndex: 7 }}
          >
            <div style={{ width: '40vw', height: '40vw' }}>
              <video
                src={vidSrc0}
                autoPlay
                muted
                loop
                className={styles.video}
              />
            </div>
            <div className={styles.videosBlank}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection2
