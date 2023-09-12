import React, { useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import cloud1Img from '@/assets/images/home-section-1/cloud1.webp'
import cloud2Img from '@/assets/images/home-section-1/cloud2.webp'
import cloud3Img from '@/assets/images/home-section-1/cloud3.webp'
import architectureImg from '@/assets/images/home-section-1/concrete.webp'
import islandImg from '@/assets/images/home-section-1/island.webp'
import oceanImg from '@/assets/images/home-section-1/ocean.webp'
import skyImg from '@/assets/images/home-section-1/sky.webp'
import ScrollDown from '@/atoms/ui/ScrollDown'

import OceanFiltered from './OceanFiltered'
import styles from './HomeSection1.module.scss'

const LAYER_DEPTH = 50 // css 3d-preserve factor: layer -> tranlsateZ
const SCROLL_OFFSET = 200 // offset for handlescroll

function HomeSection1() {
  // element refs
  const backgroundRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // get the elements
    const background = backgroundRef.current as HTMLDivElement
    const sticky = stickyRef.current as HTMLDivElement
    const gradientFade = gradientRef.current as HTMLDivElement
    const parallexEles = Array.from(
      document.querySelector(`.${styles.mouseMove}`)
        ?.children as HTMLCollectionOf<HTMLElement>
    )

    // intiate scroll data
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData1() {
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - sticky.offsetHeight
    }

    // move elements according to scroll position
    let hasListener = false
    const handleScroll = function setElementsPosition1() {
      const scrollTop = window.scrollY

      if (scrollTop > scrollEnd + sticky.offsetHeight) return

      gradientFade.style.opacity = `${
        (scrollTop - scrollStart) / (scrollEnd - scrollStart - SCROLL_OFFSET)
      }`
    }

    // move elements according to mouse movement
    const handleMouseMove = function moveImagesInteractively(
      e: MouseEvent | TouchEvent
    ) {
      const event = e instanceof TouchEvent ? e.touches[0] : e

      const xValue = event.clientX - window.innerWidth / 2
      const yValue = event.clientY - window.innerHeight / 2
      const rotateDeg = (xValue / (window.innerWidth / 2)) * 20

      parallexEles.forEach((el) => {
        const speedx = Number(el.dataset.speedx)
        const speedy = Number(el.dataset.speedy)
        const speedz = Number(el.dataset.speedz)
        const rotation = Number(el.dataset.rotation)
        const layer = Number(el.dataset.layer) * LAYER_DEPTH

        const leftX = parseFloat(
          getComputedStyle(el).left + getComputedStyle(el).right
        )
        const isInLeft = leftX < window.innerWidth ? 1 : -1
        const zValue = event.clientX - leftX * isInLeft * 0.1

        el.style.transform = `
        rotateY(${rotateDeg * rotation}deg)
        translate(
          calc(-50% + ${xValue * speedx}px),
          calc(-50% + ${yValue * speedy}px))
        translateZ(${zValue * speedz + layer}px)`
      })
    }

    init()

    // throttle the functions
    const throttledHandleMouseMove = throttle(handleMouseMove, 10)
    const throttledHandleScroll = throttle(handleScroll, 10)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', throttledHandleScroll)
    window.addEventListener('mousemove', throttledHandleMouseMove)
    hasListener = true
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', throttledHandleScroll)
      window.removeEventListener('mousemove', throttledHandleMouseMove)
      hasListener = false
    }
  }, [])

  return (
    <div className={styles.background} ref={backgroundRef}>
      <div className={styles.main} ref={stickyRef}>
        <div ref={gradientRef} className={styles.gradientFade}></div>
        <div className={styles.scrollDown}>
          <ScrollDown />
        </div>
        <div className={styles.mouseMove}>
          <img
            className={styles.skyImg}
            data-speedx="0"
            data-speedy="0"
            data-speedz="0"
            data-rotation="0"
            data-layer="0"
            src={skyImg}
          ></img>
          <img
            className={styles.cloud1Img}
            data-speedx="0.05"
            data-speedy="0.05"
            data-speedz="0"
            data-rotation="0.03"
            data-layer="1"
            src={cloud1Img}
          ></img>
          <img
            className={styles.cloud2Img}
            data-speedx="0.08"
            data-speedy="0.06"
            data-speedz="0"
            data-rotation="0.05"
            data-layer="1"
            src={cloud2Img}
          ></img>
          <img
            className={styles.cloud3Img}
            data-speedx="0.03"
            data-speedy="0.03"
            data-speedz="0"
            data-rotation="0.02"
            data-layer="1"
            src={cloud3Img}
          ></img>
          <img
            className={styles.islandImg}
            data-speedx="0.1"
            data-speedy="0.08"
            data-speedz="0"
            data-rotation="0.08"
            data-layer="2"
            src={islandImg}
          ></img>
          <div
            className={`${styles.oceanImg} scroll-down`}
            data-speedx="0.12"
            data-speedy="0.1"
            data-speedz="0"
            data-rotation="0.09"
            data-layer="2"
          >
            <OceanFiltered imgSrc={oceanImg} />
          </div>
          <div
            className={`${styles.galleryLogo} scroll-magnify-center`}
            data-speedx="0.15"
            data-speedy="0.12"
            data-speedz="0"
            data-rotation="0.1"
            data-layer="3"
            ref={logoRef}
          >
            <p className={`${styles.galleryLogoPreposition}`}>The</p>
            <p>Gallery</p>
          </div>
          <img
            className={`${styles.architectureImg} scroll-down`}
            data-speedx="0.18"
            data-speedy="0.15"
            data-speedz="0"
            data-rotation="0"
            data-layer="4"
            src={architectureImg}
          ></img>
        </div>
      </div>
    </div>
  )
}

export default HomeSection1
