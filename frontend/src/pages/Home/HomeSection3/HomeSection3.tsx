import React, { useEffect, useRef, useState } from 'react'
import throttle from 'lodash/throttle'
import videoSrc3 from '@/assets/videos/video3.webm'
import styles from './HomeSection3.module.scss'

const BACKGROUND_HEIGHT = 600 // vh
const SCROLL_OFFSET = 200 // offset for handlescroll

function HomeSection3() {
  // element refs
  const backgroundRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const mainFilterRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const lightRef = useRef<HTMLDivElement>(null)

  const [isTiltActivated, setIsTiltActivated] = useState(false)

  useEffect(() => {
    const video = videoRef.current?.firstElementChild as HTMLDivElement
    const light = lightRef.current as HTMLDivElement

    const handleMosueMove = function tiltTheCard(e: MouseEvent) {
      if (!isTiltActivated) return

      const { x, y, width, height } = video.getBoundingClientRect()
      const left = e.clientX - x
      const top = e.clientY - y
      const centerX = left - width / 2
      const centerY = top - height / 2

      const d = Math.sqrt(centerX ** 2 + centerY ** 2)

      video.style.boxShadow = `
        ${-centerX / 10}px  ${-centerY / 10}px 20px rgba(0, 0, 0, 0.3)
      `
      video.style.transform = `
        rotate3d(
          ${-centerY / 100},  ${centerX / 100}, 0, ${d / 10}deg
        )
        scale3d(1.05, 1.05, 1.05)
      `
      light.style.backgroundImage = `
        radial-gradient(
          circle at ${left}px ${top}px, #00000010, #ffffff00, #ffffff70
        )
      `
    }

    const throttledHandleMouseMove = throttle(handleMosueMove, 10)
    const handleMouseEnter = function addMouseMoveListener() {
      if (isTiltActivated) {
        video.addEventListener('mousemove', throttledHandleMouseMove)
      }
    }
    const handleMouseLeave = function removeMouseMouveListener() {
      video.removeEventListener('mousemove', throttledHandleMouseMove)
      video.style.boxShadow = video.style.boxShadow = `
        0 0 20px rgba(0, 0, 0, 0.9)
      `
      video.style.transform = ''
      light.style.backgroundImage = `
        radial-gradient(
          circle at 0px 0px, #00000010, #ffffff00, #ffffff70
        )
      `
    }

    video.addEventListener('mouseenter', handleMouseEnter)
    video.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      video.removeEventListener('mouseenter', handleMouseEnter)
      video.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isTiltActivated])

  useEffect(() => {
    // get the elements
    const background = backgroundRef.current as HTMLDivElement
    const main = mainRef.current as HTMLDivElement
    const mainFilter = mainFilterRef.current as HTMLDivElement
    const phrase = phraseRef.current as HTMLDivElement
    const video = videoRef.current as HTMLDivElement
    const light = lightRef.current as HTMLDivElement
    const videoFrame = video.firstElementChild as HTMLDivElement

    background.style.setProperty(
      '--background-height',
      `${BACKGROUND_HEIGHT}vh`
    )

    // init the data
    let scrollStart = 0
    let scrollEnd = 0
    let scrollMiddle = 0
    const init = function setInitialPositionData2() {
      // initiate scroll data
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight
      scrollMiddle = scrollEnd - 2 * main.offsetHeight

      // initiate video position
      const posx = Number(video.dataset.posx)
      const posy = Number(video.dataset.posy)
      video.style.left = `${100 * posx}vw`
      video.style.top = `${100 * posy}vh`
    }

    const handleScroll = function setElementsPosition2() {
      const scrollTop = window.scrollY

      if (scrollTop < scrollStart - SCROLL_OFFSET || scrollTop > scrollEnd)
        return

      let factor = (scrollTop - scrollStart) / (scrollMiddle - scrollStart)
      factor = factor > 1 ? 1 : factor

      const speedy = Number(video.dataset.speedy)
      const videoSrc = video.querySelector('video') as HTMLVideoElement
      video.style.transform = `
        translateY(${-factor * 100 * speedy}vh)
      `

      if (scrollTop > scrollEnd - 100) {
        main.classList.add(styles.transparent)
        mainFilter.classList.add(styles.transparent)
        main.classList.remove(styles.white)
        mainFilter.classList.remove(styles.white)
        videoSrc.pause()
        setIsTiltActivated(true)
        video.style.transform = `
          translateY(${-factor * 100 * speedy}vh)
          scale3d(1.1, 1.1, 1.1)
        `
        light.style.backgroundImage = `
          radial-gradient(
            circle at 0px 0px, #00000010, #ffffff00, #ffffff70
          )
        `
        videoFrame.style.boxShadow = `
          0 0 20px rgba(0, 0, 0, 0.9)
        `
      } else if (scrollTop > scrollMiddle) {
        main.classList.add(styles.white)
        mainFilter.classList.add(styles.white)
        main.classList.remove(styles.transparent)
        mainFilter.classList.remove(styles.transparent)
        videoSrc.pause()
        setIsTiltActivated(false)
        light.style.backgroundImage = ''
        videoFrame.style.boxShadow = ''
      } else {
        main.classList.remove(styles.white)
        mainFilter.classList.remove(styles.white)
        main.classList.remove(styles.transparent)
        mainFilter.classList.remove(styles.transparent)
        videoSrc.play()
        setIsTiltActivated(false)
        light.style.backgroundImage = ''
        videoFrame.style.boxShadow = ''
      }
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
    <>
      <div className={styles.background} ref={backgroundRef}>
        <div className={styles.main} ref={mainRef}>
          <div className={styles.mainFilter} ref={mainFilterRef} />
          <div className={styles.phrase} ref={phraseRef}>
            <p>사진을 한 장씩 골라</p>
            <p>이름 짓고 공유할 때</p>
            <p>추억으로 기억됩니다</p>
          </div>
        </div>
      </div>
      <div
        data-posx="0.6"
        data-posy="1.25"
        data-speedy="1"
        style={{ zIndex: 3, width: '20vw', height: '25vw' }}
        ref={videoRef}
        className={styles.video}
      >
        <div className={styles.videoContainer}>
          <video
            autoPlay
            muted
            loop
            src={videoSrc3}
            className={styles.videoSrc}
          />
          <div className={styles.videoLeftFrame} />
          <div className={styles.videoRightFrame} />
          <div className={styles.videoTopFrame} />
          <div className={styles.videoBottomFrame} />
          <div className={styles.videoLight} ref={lightRef} />
        </div>
      </div>
    </>
  )
}

export default HomeSection3
