import React, { useEffect, useRef, useState } from 'react'
import throttle from 'lodash/throttle'
import videoSrc3 from '@/assets/videos/video3.webm'
import styles from './HomeSection3.module.scss'
import CircleLogo from '@/assets/svgs/circle.svg'
import MagneticButton from '@/atoms/ui/MagneticButton'
import Button from '@/atoms/ui/Button'

const BACKGROUND_HEIGHT = 230 // vh
const SCROLL_OFFSET = 0.3 // * 100vh

function HomeSection3() {
  // element refs
  const backgroundRef = useRef<HTMLDivElement>(null)

  const mainRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  const phraseRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const videoLightRef = useRef<HTMLDivElement>(null)
  const videoFrameRef = useRef<HTMLDivElement>(null)
  const videoLabelRef = useRef<HTMLDivElement>(null)

  /**
   * Handle MouuseMove Event
   */
  const [isTiltActivated, setIsTiltActivated] = useState(false)

  useEffect(() => {
    const videoContainer = videoContainerRef.current as HTMLDivElement
    const video = videoRef.current as HTMLDivElement
    const videoLight = videoLightRef.current as HTMLDivElement

    const handleMosueMove = function tiltTheCard(e: MouseEvent) {
      if (!isTiltActivated) return
      const { x, y, width, height } = videoContainer.getBoundingClientRect()
      const left = e.clientX - x
      const top = e.clientY - y
      const centerX = left - width / 2
      const centerY = top - height / 2
      const d = Math.sqrt(centerX ** 2 + centerY ** 2)

      video.style.overflow = 'visible'

      video.style.boxShadow = `
        ${-centerX / 10}px  ${-centerY / 10}px 20px rgba(0, 0, 0, 0.3)
      `
      video.style.transform = `
        rotate3d(
          ${-centerY / 80},  ${centerX / 80}, 0, ${d / 8}deg
        )
        scale3d(1.05, 1.05, 1.05)
      `
      videoLight.style.backgroundImage = `
        radial-gradient(
          circle at ${left}px ${top}px, #00000010, #ffffff00, #ffffff70
        )
      `
    }

    const throttledHandleMouseMove = throttle(handleMosueMove, 10)

    const handleMouseEnter = function addMouseMoveListener() {
      if (isTiltActivated) {
        videoContainer.addEventListener('mousemove', throttledHandleMouseMove)
      }
    }
    const handleMouseLeave = function removeMouseMouveListener() {
      videoContainer.removeEventListener('mousemove', throttledHandleMouseMove)
      video.style.boxShadow = videoContainer.style.boxShadow = ''
      video.style.transform = ''
      videoLight.style.backgroundImage = `
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

  /**
   * Handle Scroll Event
   */
  useEffect(() => {
    // get the elements
    const background = backgroundRef.current as HTMLDivElement
    const main = mainRef.current as HTMLDivElement
    const filter = filterRef.current as HTMLDivElement
    const circle = circleRef.current as HTMLDivElement
    const phrase = phraseRef.current as HTMLDivElement
    const button = buttonRef.current as HTMLDivElement
    const videoContainer = videoContainerRef.current as HTMLDivElement
    const video = videoRef.current as HTMLDivElement
    const videoFrame = videoFrameRef.current as HTMLDivElement
    const videoLight = videoLightRef.current as HTMLDivElement
    const videoLabel = videoLabelRef.current as HTMLDivElement

    // Set the background height
    background.style.setProperty(
      '--background-height',
      `${BACKGROUND_HEIGHT}vh`
    )

    // Initiate the data
    let scrollStart = 0
    let scrollEnd = 0
    let scrollDivision = 0
    const init = function setInitialPositionData2() {
      // Initiate scroll data
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - main.offsetHeight
      scrollDivision = scrollEnd - SCROLL_OFFSET * main.offsetHeight

      // Initiate video position
      const posx = Number(videoContainer.dataset.posx)
      const posy = Number(videoContainer.dataset.posy)
      videoContainer.style.right = `${-100 * posx}vw`
      videoContainer.style.top = `${100 * posy}vh`
    }

    // Handle Scroll
    const handleScroll = function setElementsPosition() {
      const scrollTop = window.scrollY
      console.log(scrollStart, scrollEnd, scrollDivision, window.scrollY)

      if (scrollTop < scrollStart || scrollTop > scrollEnd) return

      // move video
      let moveFactor =
        (scrollTop - scrollStart) / (scrollDivision - scrollStart)
      moveFactor = moveFactor > 1 ? 1 : moveFactor

      videoContainer.style.transform = `
        translateY(calc(-50% - ${moveFactor * 100}vh))
      `

      const videoSrc = video.querySelector('video') as HTMLVideoElement
      if (scrollTop < scrollDivision) {
        // change background color
        filter.classList.remove(styles.transparent)
        circle.classList.remove(styles.visible)

        // remove mix-blend-mode
        phrase.classList.remove(styles.blend)
        phrase.classList.remove(styles.next)

        // hide button
        button.classList.remove(styles.visible)

        // play video
        videoSrc.play()

        // unframe the video & hide label
        videoFrame.classList.remove(styles.visible)
        videoLabel.classList.remove(styles.visible)

        // disable tilt
        setIsTiltActivated(false)

        // 2D css
        video.style.overflow = 'hidden'
        video.style.boxShadow = ''
        videoLight.style.backgroundImage = ''
      } else {
        // background filter change
        filter.classList.add(styles.transparent)
        circle.classList.add(styles.visible)

        // add mix-blend-mode
        phrase.classList.add(styles.blend)
        phrase.classList.add(styles.next)

        // show button
        button.classList.add(styles.visible)

        // stop video
        videoSrc.pause()

        // frame the video & show label
        videoFrame.classList.add(styles.visible)
        videoLabel.classList.add(styles.visible)

        // enable tilt
        setIsTiltActivated(true)

        // 3d css
        videoFrame.style.boxShadow = ''
        videoLight.style.backgroundImage = `
        radial-gradient(
          circle at 0px 0px, #00000010, #ffffff00, #ffffff70
        )
      `
      }
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
        <div className={styles.mainFilter} ref={filterRef} />
        <div className={styles.mainCircle} ref={circleRef}>
          <CircleLogo />
          <CircleLogo />
        </div>
        <div className={styles.mainPhrase} ref={phraseRef}>
          <div>
            <p>스쳐버린 순간 사이에서</p>
            <p>찰나를 붙잡아 이름짓고</p>
            <p>하나의 작품을 만들세요</p>
          </div>
          <div>
            <p>더 갤러리가</p>
            <p>오직 당신만을 위한</p>
            <p>3D 전시회를 준비했습니다</p>
          </div>
        </div>
        <div className={styles.mainButton} ref={buttonRef}>
          <MagneticButton
            text="체험하기"
            ariaLabel="예시 3D 전시회 페이지로"
            size="lg"
            color="primary"
          />
        </div>
        <div
          data-posx="-0.1"
          data-posy="1.55"
          ref={videoContainerRef}
          className={styles.mainVideoContainer}
        >
          <div className={styles.mainVideo} ref={videoRef}>
            <div className={styles.mainVideoFrame} ref={videoFrameRef}>
              <div className={styles.mainVideoFrameLeft} />
              <div className={styles.mainVideoFrameRight} />
              <div className={styles.mainVideoFrameTop} />
              <div className={styles.mainVideoFrameBottom} />
              <div className={styles.mainVideoFrameBack} />
            </div>
            <video
              autoPlay
              muted
              loop
              src={videoSrc3}
              className={styles.mainVideoSrc}
            />
            <div className={styles.mainVideoLight} ref={videoLightRef} />
          </div>
          <div className={styles.mainVideoLabel} ref={videoLabelRef}>
            <p>작품명</p>
            <p>마우스를 올려보세요</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection3
