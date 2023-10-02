import React, { useEffect, useRef, useState, useCallback } from 'react'
import throttle from 'lodash/throttle'
import bgm from '@/assets/audio/MapleStory-Lith-Harbor.mp3'
import cloud1Img from '@/assets/images/home-section-1/cloud1.webp'
import cloud2Img from '@/assets/images/home-section-1/cloud2.webp'
import cloud3Img from '@/assets/images/home-section-1/cloud3.webp'
import architectureImg from '@/assets/images/home-section-1/concrete.webp'
import islandImg from '@/assets/images/home-section-1/island.webp'
import oceanImg from '@/assets/images/home-section-1/ocean.webp'
import skyImg from '@/assets/images/home-section-1/sky.webp'
import Loading from '@/atoms/ui/Loading'
import ScrollDown from '@/atoms/ui/ScrollDown'
import OceanFiltered from './OceanFiltered'
import styles from './HomeSection1.module.scss'

const TOTAL_IMAGE = 7
const LAYER_DEPTH = 50 // css 3d-preserve factor: layer -> tranlsateZ
const SCROLL_OFFSET = 300

function HomeSection1() {
  /**
   * Hide the filter after the image loading
   */
  const transitionRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const handleImageLoad = function countLoadedImages() {
    setImagesLoaded((num) => num + 1)
  }

  const handleScroll = useCallback(function disableScroll(e: Event) {
    e.preventDefault()
    window.scrollTo(0, 0)
    console.log(1)
  }, [])

  // disable scroll
  useEffect(() => {
    addEventListener('scroll', handleScroll, { passive: false })
    return () => {
      removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Change the loading state
  useEffect(() => {
    const transition = transitionRef.current!
    if (imagesLoaded === TOTAL_IMAGE) {
      const nodes = transition.childNodes as NodeListOf<HTMLElement>
      nodes.forEach((node: HTMLElement) => {
        node.classList.add(styles.loaded)
      })
    }
  }, [imagesLoaded])

  // Hide the transition layer
  const handleClick = function playAudio() {
    if (imagesLoaded != TOTAL_IMAGE) return
    // play audio
    const audio = document.querySelector('#audio') as HTMLAudioElement
    console.log(audio)
    audio.play()

    // show logo
    const logo = logoRef.current!
    logo.classList.remove(styles.hidden)

    // hide transition layer
    const transition = transitionRef.current!
    transition.classList.add(styles.hidden)

    // activate scrolling
    removeEventListener('scroll', handleScroll)
  }

  /**
   * Scroll & Mousemouve event hadling
   */
  const backgroundRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the elements
    const background = backgroundRef.current!
    const main = mainRef.current!
    const gradientFade = gradientRef.current!
    const interactiveEles = Array.from(
      document.querySelector(`.${styles.mainInter}`)
        ?.children as HTMLCollectionOf<HTMLElement>
    )

    // Initiate scroll data
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData1() {
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight
    }

    // Scroll Event: fade in the gradient filter
    const handleScroll = function setElementsPosition1() {
      const scrollTop = window.scrollY

      if (scrollTop > scrollEnd + main.offsetHeight) return

      if (scrollTop > scrollStart + SCROLL_OFFSET) {
        gradientFade.style.opacity = `${
          (scrollTop - scrollStart - SCROLL_OFFSET) /
          (scrollEnd - scrollStart - SCROLL_OFFSET)
        }`
      } else {
        gradientFade.style.opacity = `0`
      }
    }

    // Mouse Event: move elements according to the mouse position
    const handleMouseMove = function moveImagesInteractively(
      e: MouseEvent | TouchEvent
    ) {
      // Transfrom touch event
      const event = e instanceof TouchEvent ? e.touches[0] : e

      // Set the factor based on mouse position
      const xValue = event.clientX - window.innerWidth / 2
      const yValue = event.clientY - window.innerHeight / 2
      const rotateDeg = (xValue / (window.innerWidth / 2)) * 20

      // Move elements
      interactiveEles.forEach((el) => {
        // Get each element factor
        const speedx = Number(el.dataset.speedx)
        const speedy = Number(el.dataset.speedy)
        const speedz = Number(el.dataset.speedz)
        const rotation = Number(el.dataset.rotation)
        const layer = Number(el.dataset.layer) * LAYER_DEPTH

        // Determine zValue based on whether the element is in the left side
        const leftX = parseFloat(
          getComputedStyle(el).left + getComputedStyle(el).right
        )
        const isInLeft = leftX < window.innerWidth ? 1 : -1
        const zValue = event.clientX - leftX * isInLeft * 0.1

        // Move element
        el.style.transform = `
        rotateY(${rotateDeg * rotation}deg)
        translate3d(
          calc(-50% + ${xValue * speedx}px),
          calc(-50% + ${yValue * speedy}px), 
          ${zValue * speedz + layer}px
          )
        `
      })
    }

    init()

    // throttle the functions
    const throttledHandleMouseMove = throttle(handleMouseMove, 10)
    const throttledHandleScroll = throttle(handleScroll, 10)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    window.addEventListener('mousemove', throttledHandleMouseMove)
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', throttledHandleScroll)
      window.removeEventListener('mousemove', throttledHandleMouseMove)
    }
  }, [])

  return (
    <>
      <div className={styles.background} ref={backgroundRef}>
        <div className={styles.main} ref={mainRef}>
          <div ref={gradientRef} className={styles.mainGradientFade}></div>
          <div className={styles.mainScrollDown}>
            <ScrollDown />
          </div>
          <div className={styles.mainInter}>
            <img
              className={styles.mainInterSky}
              data-speedx="0"
              data-speedy="0"
              data-speedz="0"
              data-rotation="0"
              data-layer="0"
              alt="sky"
              src={skyImg}
              onLoad={handleImageLoad}
            />
            <div
              className={styles.mainInterCloud1}
              data-speedx="0.07"
              data-speedy="0.05"
              data-speedz="0"
              data-rotation="0.03"
              data-layer="1"
            >
              <img alt="cloud 1" src={cloud1Img} onLoad={handleImageLoad} />
            </div>
            <div
              className={styles.mainInterCloud2}
              data-speedx="0.08"
              data-speedy="0.06"
              data-speedz="0"
              data-rotation="0.05"
              data-layer="1"
            >
              <img alt="cloud 2" src={cloud2Img} onLoad={handleImageLoad} />
            </div>
            <div
              className={styles.mainInterCloud3}
              data-speedx="0.05"
              data-speedy="0.03"
              data-speedz="0"
              data-rotation="0.02"
              data-layer="1"
            >
              <img alt="cloud 3" src={cloud3Img} onLoad={handleImageLoad} />
            </div>
            <img
              className={styles.mainInterIsland}
              data-speedx="0.07"
              data-speedy="0.08"
              data-speedz="0"
              data-rotation="0.08"
              data-layer="2"
              alt="island"
              src={islandImg}
              onLoad={handleImageLoad}
            />
            <div
              className={`${styles.mainInterOcean} scroll-down`}
              data-speedx="0.07"
              data-speedy="0.08"
              data-speedz="0"
              data-rotation="0.09"
              data-layer="2"
            >
              <OceanFiltered
                imgSrc={oceanImg}
                alt="ocean"
                onLoad={handleImageLoad}
              />
            </div>
            <div
              ref={logoRef}
              className={`${styles.mainInterLogo} ${styles.hidden} scroll-magnify-center`}
              data-speedx="0.25"
              data-speedy="0.05"
              data-speedz="0"
              data-rotation="0.1"
              data-layer="3"
            >
              <p className={`${styles.mainInterLogoPreposition}`}>The</p>
              <p>Gallery</p>
            </div>
            <img
              className={`${styles.mainInterArchitect} scroll-down`}
              data-speedx="0.16"
              data-speedy="0.12"
              data-speedz="0"
              data-rotation="0"
              data-layer="4"
              alt="architecture"
              src={architectureImg}
              onLoad={handleImageLoad}
            />
          </div>
        </div>
      </div>
      {/* Transition Layer */}
      <div
        className={styles.transition}
        ref={transitionRef}
        onClick={handleClick}
      >
        <div className={styles.transitionLoading}>
          <Loading />
        </div>
        <div className={styles.transitionPhrase}>
          <p>환영합니다</p>
          <p>화면을 클릭해주세요</p>
        </div>
      </div>
    </>
  )
}

export default HomeSection1
