import { useEffect, useRef, useState, useCallback } from 'react'
import OceanFilter from './OceanFilter'
import cloud1Img from '@/assets/images/home-section-1/cloud-1.png?format=png'
import cloud1Webp from '@/assets/images/home-section-1/cloud-1.png?format=webp'
import cloud2Img from '@/assets/images/home-section-1/cloud-2.png?format=png'
import cloud2Webp from '@/assets/images/home-section-1/cloud-2.png?format=webp'
import cloud3Img from '@/assets/images/home-section-1/cloud-3.png?format=png'
import cloud3Webp from '@/assets/images/home-section-1/cloud-3.png?format=webp'
import galleryImg from '@/assets/images/home-section-1/gallery.png?format=png'
import galleryWebp from '@/assets/images/home-section-1/gallery.png?format=webp'
import oceanImg from '@/assets/images/home-section-1/ocean.png?format=png'
import oceanWebp from '@/assets/images/home-section-1/ocean.png?format=webp'
import skyImg from '@/assets/images/home-section-1/sky.png?format=webp'
import skyWebp from '@/assets/images/home-section-1/sky.png?format=webp'
import Loading from '@/atoms/ui/Loading'
import ScrollDown from '@/atoms/ui/ScrollDown'
import StaticImage from '@/atoms/ui/StaticImage'
import musicManager from '@/utils/musicManager'
import toFrame from '@/utils/toFrame'
import './HomeSection1.scss'

const TOTAL_IMAGE = 6
const BACK_HEIGHT = 2 // * 100dvh. background height
const SCROLL_OFFSET = 300 // px. fade start offset on scroll
const ROTATION_DEGREE = 20 // deg. max rotation degree on mousemove

function HomeSection1() {
  /**
   * Set the background height
   */
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const back = backRef.current!

    back.style.setProperty('--height-back', `${BACK_HEIGHT * 100}dvh`)
    back.style.setProperty('--back-min-height', `${BACK_HEIGHT * 600}px`)
  }, [])

  /**
   * Disable scroll on mount
   */
  const disableScroll = useCallback(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    addEventListener('scroll', disableScroll, { passive: false }) // actively disable scroll

    return () => {
      removeEventListener('scroll', disableScroll)
    }
  }, [])

  /**
   * Handle image loading
   */
  const [imagesLoaded, setImagesLoaded] = useState(0)

  const handleImageLoad = function countLoadedImages() {
    setImagesLoaded((num) => num + 1)
  }

  /**
   * Handle transition
   * 1. Play audio
   * 2. Show interactive logo
   * 3. Hide cover layer
   * 4. Enable scrolling
   */
  const coverRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  const handleClick = function playAudio() {
    if (imagesLoaded != TOTAL_IMAGE) return

    // play audio
    musicManager.playAudio()

    // show interactive logo
    const logo = logoRef.current!
    logo.classList.add('opaque')

    // hide cover layer
    const cover = coverRef.current!
    cover.classList.add('hide')

    // enable scrolling
    removeEventListener('scroll', disableScroll)
  }

  /**
   * Mousemove Event Handling
   */
  const interactRef = useRef<HTMLDivElement>(null)
  const isMousemove = useRef(true)

  useEffect(() => {
    // Get the elements
    const interact = interactRef.current!
    const interactEles = Array.from(interact.children as HTMLCollectionOf<HTMLDivElement>)

    // Handle mouse event
    const handleMousemove = function moveHS1Elements(e: MouseEvent) {
      // mousemove optimization
      if (!isMousemove.current) return

      // Set distance values from the mouse position
      const xValue = e.clientX - window.innerWidth / 2
      const yValue = e.clientY - window.innerHeight / 2
      const rValue = (xValue / (window.innerWidth / 2)) * ROTATION_DEGREE

      // Move interactive elements
      interactEles.forEach((el) => {
        // Get factors from the element
        const speedx = Number(el.dataset.speedx)
        const speedy = Number(el.dataset.speedy)
        const speedr = Number(el.dataset.speedr)

        // Move the element
        el.style.transform = `
        rotateY(${rValue * speedr}deg)
        translate(
          calc(-50% + ${xValue * speedx}px),
          calc(-50% + ${yValue * speedy}px)
          )
        `
      })
    }

    const optimizedHandleMouseMove = toFrame(handleMousemove)

    window.addEventListener('mousemove', optimizedHandleMouseMove)
    return () => {
      window.removeEventListener('mousemove', optimizedHandleMouseMove)
    }
  }, [])

  /**
   * Scroll Event Handling
   */
  const mainRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get the elements
    const back = backRef.current!
    const main = mainRef.current!
    const fade = fadeRef.current!

    // Initiate scroll data
    let scrollStart = 0
    let scrollEnd = 0
    const init = function initiateHS1ScrollData() {
      scrollStart = window.pageYOffset + back.getBoundingClientRect().top
      scrollEnd = scrollStart + back.offsetHeight - main.offsetHeight
    }

    // Handle scroll event
    const handleScroll = function fadeHS1() {
      const scrollTop = window.scrollY

      // Scroll & Mouse optimization
      if (scrollTop < scrollStart || scrollTop > scrollEnd + main.offsetHeight) {
        isMousemove.current = false
        return
      }

      // Scroll & Mouse optimization
      isMousemove.current = true

      // handle fade gradient layer opacity
      if (scrollTop < scrollStart + SCROLL_OFFSET) {
        fade.classList.remove('fade')
      } else {
        fade.classList.add('fade')
      }
    }

    init()
    const optimizedHandleScroll = toFrame(handleScroll)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', optimizedHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', optimizedHandleScroll)
    }
  }, [])

  return (
    <>
      <div className="hs1-back" ref={backRef}>
        <div className="hs1-main" ref={mainRef}>
          <div className="hs1-fade" ref={fadeRef}></div>
          <div className="hs1-scroll">
            <ScrollDown />
          </div>
          <div className="hs1-interact" ref={interactRef}>
            <div className="hs1-interact__sky" data-speedx="0" data-speedy="0" data-speedr="0">
              <StaticImage
                imgSrc={skyImg}
                webpSrc={skyWebp}
                alt="푸른 하늘"
                loading="eager"
                onLoad={handleImageLoad}
              />
            </div>
            <div
              className="hs1-interact__cloud-1"
              data-speedx="0.07"
              data-speedy="0.05"
              data-speedr="0.03"
            >
              <StaticImage
                imgSrc={cloud1Img}
                webpSrc={cloud1Webp}
                sizes="(max-width: 720px) 110vw, (max-width: 1080px) 75vw, 65vw"
                alt="높고 가까운 구름"
                loading="eager"
                onLoad={handleImageLoad}
              />
            </div>
            <div
              className="hs1-interact__cloud-2"
              data-speedx="0.08"
              data-speedy="0.06"
              data-speedr="0.05"
            >
              <StaticImage
                imgSrc={cloud2Img}
                webpSrc={cloud2Webp}
                sizes="(max-width: 720px) 110vw, (max-width: 1080px) 75vw, 65vw"
                alt="중간 높이의 가까운 구름"
                loading="eager"
                onLoad={handleImageLoad}
              />
            </div>
            <div
              className="hs1-interact__cloud-3"
              data-speedx="0.05"
              data-speedy="0.03"
              data-speedr="0.02"
            >
              <StaticImage
                imgSrc={cloud3Img}
                webpSrc={cloud3Webp}
                sizes="(max-width: 720px) 70vw, (max-width: 1080px) 50vw, 40vw"
                alt="낮고 먼 구름"
                loading="eager"
                onLoad={handleImageLoad}
              />
            </div>
            {/* <div
              className="hs1-interact__island"
              data-speedx="0.07"
              data-speedy="0.08"
              data-speedr="0.08"
            >
              <StaticImage
                imgSrc={islandImg}
                webpSrc={islandWebp}
                alt="멀리 있는 섬"
                sizes="(max-width: 720px) 110vw, (max-width: 1080px) 80vw, 30vw"
                onLoad={handleImageLoad}
              />
            </div> */}
            <div
              className="hs1-interact__ocean"
              data-speedx="0.07"
              data-speedy="0.08"
              data-speedr="0.09"
            >
              <div className="hs1-interact__ocean-filter">
                <StaticImage
                  imgSrc={oceanImg}
                  webpSrc={oceanWebp}
                  sizes="(max-width: 720px) 200vw, (max-width: 1080px) 150vw, 120vw"
                  alt="일렁이는 수평선의 푸른 바다"
                  loading="eager"
                  onLoad={handleImageLoad}
                />
                <OceanFilter />
              </div>
            </div>
            <div
              ref={logoRef}
              className="hs1-interact__logo"
              data-speedx="0.25"
              data-speedy="0.05"
              data-speedr="0.1"
            >
              <span>The</span>
              <span>Gallery</span>
            </div>
            <div
              className="hs1-interact__gallery"
              data-speedx="0.16"
              data-speedy="0.12"
              data-speedr="0"
            >
              <StaticImage
                imgSrc={galleryImg}
                webpSrc={galleryWebp}
                alt="바로 앞에 보이는 갤러리 테라스 바닥 일부"
                sizes="(max-width: 720px) 300vw, (max-width: 1080px) 200vw, 100vw"
                loading="eager"
                onLoad={handleImageLoad}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Transition Layer */}
      <div className="hs1-cover" ref={coverRef} onClick={handleClick}>
        {imagesLoaded >= TOTAL_IMAGE ? (
          <div className="hs1-cover__phrase">
            <h1 tabIndex={0} onKeyDown={handleClick}>
              환영합니다
            </h1>
            <h2>클릭하면 배경음악이 재생됩니다</h2>
          </div>
        ) : (
          <div className="hs1-cover__loading">
            <Loading />
          </div>
        )}
      </div>
    </>
  )
}

export default HomeSection1
