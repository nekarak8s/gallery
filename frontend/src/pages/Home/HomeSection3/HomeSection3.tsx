import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'

import imgSrc0 from '@/assets/images/home-section-2/unsplash-0.jpg'
import backgroundImg from '@/assets/images/home-section-3/gallery-background.png'

import styles from './HomeSection3.module.scss'

function HomeSection3() {
  // element refs
  const backgroundRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const fadeOutRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // get the elements
    const background = backgroundRef.current as HTMLDivElement
    const main = mainRef.current as HTMLDivElement
    const phrase = phraseRef.current as HTMLDivElement
    const images = imagesRef.current as HTMLDivElement
    const fadeOut = fadeOutRef.current as HTMLDivElement

    const imageEles = Array.from(
      images.children as HTMLCollectionOf<HTMLElement>
    )

    // init the data
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData2() {
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight

      imageEles.forEach((el) => {
        const posx = Number(el.dataset.posx)
        const posy = Number(el.dataset.posy)
        el.style.left = `${30 * posx}vw`
        el.style.top = `${100 * posy + 50}vh`
      })
    }

    const handleScroll = function setElementsPosition2() {
      const scrollTop = window.scrollY

      if (scrollTop < scrollStart || scrollTop > scrollEnd) return

      console.log(3)
      console.log(scrollTop, scrollEnd)
      if (scrollTop > scrollEnd - 200) {
        main.classList.add(styles.transparent)
        fadeOut.classList.add(styles.transparent)
      } else {
        main.classList.remove(styles.transparent)
        fadeOut.classList.remove(styles.transparent)
      }

      const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)

      imageEles.forEach((el) => {
        const speedy = Number(el.dataset.speedy)
        el.style.transform = `translateY(calc(-50% + ${
          (1 - factor) * 100 * speedy
        }vh))`
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
        <div className={styles.fadeOut} ref={fadeOutRef} />
        <div className={styles.phrase} ref={phraseRef}>
          <p data-speedy="0" style={{ zIndex: 4 }}>
            ABCDABCDAABCD
          </p>
          <p data-speedy="0" style={{ zIndex: 2 }}>
            ABCDABCDAABCD
          </p>
        </div>
        <div className={styles.images} ref={imagesRef}>
          <div
            data-posx="2.3"
            data-posy="0"
            data-speedy="0.9"
            style={{ zIndex: 3, width: '20vw', height: '25vw' }}
          >
            <img src={imgSrc0} className={styles.image} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection3
