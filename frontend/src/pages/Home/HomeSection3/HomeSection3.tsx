import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { routes } from '@/App'
import labelImg from '@/assets/images/home-section-3/white-label.jpg?format=jpg'
import labelWebp from '@/assets/images/home-section-3/white-label.jpg?format=webp'
import wallImg from '@/assets/images/home-section-3/white-wall.jpg?format=jpg'
import wallWebp from '@/assets/images/home-section-3/white-wall.jpg?format=webp'
import CircleIcon from '@/assets/svgs/circle.svg'
import vidSrc from '@/assets/videos/home-video-4.mp4'
import webmSrc from '@/assets/videos/home-video-4.webm'
import Button3D from '@/atoms/ui/Button3D'
import StaticImage from '@/atoms/ui/StaticImage'
import StaticVideo from '@/atoms/ui/StaticVideo'
import { CURSOR_SCALE } from '@/constants'
import useMobile from '@/hooks/useMobile'
import throttle from '@/utils/throttle'
import './HomeSection3.scss'

const BACK_HEIGHT = 3 // * 100vh
const SCROLL_OFFSET = 300 // px.

function HomeSection3() {
  const { t } = useTranslation()
  const isMobile = useMobile()

  /**
   * Set the background height
   */
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const back = backRef.current!

    back.style.setProperty('--height-back', `calc(${BACK_HEIGHT * 100}vh + ${SCROLL_OFFSET}px)`)
    back.style.setProperty('--min-height-back', `calc(${BACK_HEIGHT * 600}px + ${SCROLL_OFFSET}px)`)
  }, [])

  /**
   * Scroll Event Hadling
   * 1. Move art work (transform)
   * 2. Toggle video (play / pause)
   * 3. Toggle fade (opacity)
   * 4. Toggle circle (transform)
   * 5. Toggle phrase (transform)
   * 6. Toggle button (visibility)
   * 7. Toggle videoFrame (transform)
   * 8. Toggle label (opacity)
   * 9. Toggle tilting availability (useState)
   */
  const mainRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const workRef = useRef<HTMLDivElement>(null)
  const videoFrameRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the elements
    const back = backRef.current!
    const main = mainRef.current!
    const filter = fadeRef.current!
    const circle = circleRef.current!
    const phrase = phraseRef.current!
    const button = buttonRef.current!
    const work = workRef.current!
    const videoFrame = videoFrameRef.current!
    const label = labelRef.current!

    const video = work.getElementsByTagName('video')[0]

    // Initiate scroll data & art work position
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData2() {
      // Initiate scroll data
      scrollStart = window.scrollY + back.getBoundingClientRect().top
      scrollEnd = scrollStart + back.offsetHeight - main.offsetHeight

      // Initiate art work position
      const posx = Number(work.dataset.posx)
      const posy = Number(work.dataset.posy)
      work.style.right = `${-100 * posx}vw`
      work.style.top = `${100 * posy}vh`
    }

    // Handle Scroll
    const handleScroll = function handleHS3Scroll() {
      const scrollTop = window.scrollY

      // Scroll optimization
      if (scrollTop < scrollStart || scrollTop > scrollEnd + main.offsetHeight) return

      // Move art work
      const factor = (scrollTop - scrollStart) / (scrollEnd - SCROLL_OFFSET - scrollStart)
      work.style.transform = `
        translateY(calc(-50% - ${(factor > 1 ? 1 : factor) * 85}vh))
      `

      if (scrollTop < scrollEnd - SCROLL_OFFSET) {
        // Play video
        video.play()

        // Toggle classes
        filter.classList.remove('transparent')
        circle.classList.remove('show')
        phrase.classList.remove('next')
        button.classList.remove('visible')
        videoFrame.classList.remove('show')
        label.classList.remove('opaque')

        // Disable tilt
        isMousemove.current = false
      } else {
        // Play video
        video.pause()

        // Toggle classes
        filter.classList.add('transparent')
        circle.classList.add('show')
        phrase.classList.add('next')
        button.classList.add('visible')
        videoFrame.classList.add('show')
        label.classList.add('opaque')

        // Activateb tilt
        isMousemove.current = true
      }
    }

    init()

    const optimizedHandleScroll = throttle(handleScroll, 16)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', optimizedHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', optimizedHandleScroll)
    }
  }, [])

  /**
   * Handle Mousemove Event
   * 1. Tilt video
   * 2. Move video shadow
   * 3. Move video light
   */

  const videoRef = useRef<HTMLDivElement>(null)
  const videoLightRef = useRef<HTMLDivElement>(null)
  const isMousemove = useRef<boolean>(false)

  useEffect(() => {
    const work = workRef.current!
    const video = videoRef.current!
    const videoLight = videoLightRef.current!

    const handleMousemove = function tiltArtWork(e: MouseEvent) {
      if (!isMousemove.current) return

      const { x, y, width, height } = work.getBoundingClientRect()
      const left = e.clientX - x
      const top = e.clientY - y
      const centerX = left - width / 2
      const centerY = top - height / 2
      const d = Math.sqrt(centerX ** 2 + centerY ** 2)

      // Tilt video
      video.style.transform = `
        rotate3d(
          ${-centerY / 80},  ${centerX / 80}, 0, ${d / 8}deg
        )
        scale3d(1.05, 1.05, 1.05)
      `
      // Move video shadow
      video.style.boxShadow = `
        ${-centerX / 10}px  ${-centerY / 10}px 20px rgba(0, 0, 0, 0.3)
      `
      // Move video light
      videoLight.style.backgroundImage = `
        radial-gradient(
          circle at ${left}px ${top}px, #00000010, #ffffff00, #ffffff70
        )
      `
    }

    const optimizedHandleMousemove = throttle(handleMousemove, 16)

    const handleMouseEnter = function startArtWorkTilt() {
      if (!isMousemove.current) return
      work.style.overflow = 'visible'
    }
    const handleMouseLeave = function endArtWorkTilt() {
      work.style.overflow = 'hidden'
      video.style.transform = ''
      video.style.boxShadow = ''
      videoLight.style.backgroundImage = ''
    }

    work.addEventListener('mouseenter', handleMouseEnter)
    work.addEventListener('mouseleave', handleMouseLeave)
    work.addEventListener('mousemove', optimizedHandleMousemove)
    return () => {
      work.removeEventListener('mouseenter', handleMouseEnter)
      work.removeEventListener('mouseleave', handleMouseLeave)
      work.removeEventListener('mousemove', optimizedHandleMousemove)
    }
  }, [])

  return (
    <div className="hs3-back" ref={backRef}>
      <div className={`hs3-main ${isMobile ? '' : 'smooth'}`} ref={mainRef}>
        <div className="hs3-main__back">
          <StaticImage imgSrc={wallImg} webpSrc={wallWebp} alt="하얀 벽 배경" loading="lazy" />
        </div>
        <div className="hs3-fade" ref={fadeRef} />
        <div className="hs3-circle" ref={circleRef}>
          <CircleIcon />
          <CircleIcon />
        </div>
        <div className="hs3-phrase" ref={phraseRef}>
          <div>
            <p>{t('home.section3.phrase1')}</p>
            <p>{t('home.section3.phrase2')}</p>
            <p>{t('home.section3.phrase3')}</p>
          </div>
          <div>
            <p>{t('home.section3.phrase4')}</p>
            <p>{t('home.section3.phrase5')}</p>
            <p>{t('home.section3.phrase6')}</p>
          </div>
        </div>

        <div className="hs3-button" ref={buttonRef}>
          <Button3D ariaLabel="3D 전시회 체험하기" to={routes['Example'].path} color="blue">
            <p data-cursor-scale={CURSOR_SCALE}>{t('buttons.experience')}</p>
          </Button3D>
        </div>

        <div data-posx="-0.1" data-posy="1.48" ref={workRef} className="hs3-work">
          <div className="hs3-video" ref={videoRef}>
            <div className="hs3-video__frame" ref={videoFrameRef}>
              <div className="hs3-video__frame--left" />
              <div className="hs3-video__frame--right" />
              <div className="hs3-video__frame--top" />
              <div className="hs3-video__frame--bottom" />
              <div className="hs3-video__frame--back" />
            </div>
            <div className="hs3-video__src">
              <StaticVideo vidSrc={vidSrc} webmSrc={webmSrc} ariaLabel="랜덤 이미지" />
            </div>
            <div className="hs3-video__light" ref={videoLightRef} />
          </div>
          <div className="hs3-work__label" ref={labelRef}>
            <StaticImage imgSrc={labelImg} webpSrc={labelWebp} sizes="200px" alt="작품 라벨" />
            <div className="hs3-work__label--phrase">
              <p>{t('home.section3.workTitle')}</p>
              <p>{t('home.section3.workDescription')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection3
