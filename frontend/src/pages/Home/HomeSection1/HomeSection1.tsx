import React, { useEffect, useRef, useState, useCallback } from 'react'
import throttle from 'lodash/throttle'
import bgm from '@/assets/audio/MapleStory-Lith-Harbor.mp3'
import cloud1Img from '@/assets/images/home-section-1/cloud-1.png?format=png'
import cloud1Webp from '@/assets/images/home-section-1/cloud-1.png?format=webp'
import cloud2Img from '@/assets/images/home-section-1/cloud-2.png?format=png'
import cloud2Webp from '@/assets/images/home-section-1/cloud-2.png?format=webp'
import cloud3Img from '@/assets/images/home-section-1/cloud-3.png?format=png'
import cloud3Webp from '@/assets/images/home-section-1/cloud-3.png?format=webp'
import galleryImg from '@/assets/images/home-section-1/gallery.png?format=png'
import galleryWebp from '@/assets/images/home-section-1/gallery.png?format=webp'
import islandImg from '@/assets/images/home-section-1/island.png?format=png'
import islandWebp from '@/assets/images/home-section-1/island.png?format=webp'
import oceanImg from '@/assets/images/home-section-1/ocean.png?format=png'
import oceanWebp from '@/assets/images/home-section-1/ocean.png?format=webp'
import skyImg from '@/assets/images/home-section-1/sky.png?format=webp'
import skyWebp from '@/assets/images/home-section-1/sky.png?format=webp'
import Loading from '@/atoms/ui/Loading'
import ScrollDown from '@/atoms/ui/ScrollDown'
import OceanFilter from './OceanFilter'
import './HomeSection1.scss'
import StaticImage from '@/atoms/ui/StaticImage'

import OceanTurbulenceFilter from '@/assets/svgs/ocean-turbulence-filter.svg'

const TOTAL_IMAGE = 7
const BACK_HEIGHT = 2 // * 100vh. background height
const SCROLL_OFFSET = 300 // px. fade start offset on scroll
const ROTATION_DEGREE = 20 // deg. max rotation degree on mousemove

function HomeSection1() {
  /**
   * Set the background height
   */
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const back = backRef.current!

    back.style.setProperty('--height-back', `${BACK_HEIGHT * 100}vh`)
    back.style.setProperty('--back-min-height', `${BACK_HEIGHT * 600}px`)
  }, [])

  /**
   * Disable scroll on mount
   */
  const disableScroll = useCallback((e: Event) => {
    e.preventDefault()
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
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
    const audio = document.querySelector('#home-audio') as HTMLAudioElement
    audio.play()

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

  useEffect(() => {
    // Get the elements
    const interact = interactRef.current!
    const interactEles = Array.from(
      interact.children as HTMLCollectionOf<HTMLDivElement>
    )

    // Handle mouse event
    const handleMouseMove = function moveImagesInteractively(e: MouseEvent) {
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

    const throttledHandleMouseMove = throttle(handleMouseMove, 10)

    window.addEventListener('mousemove', throttledHandleMouseMove)
    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove)
    }
  }, [])

  /**
   * Scroll Event Hadling
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
    const init = function setInitialPositionData1() {
      scrollStart = window.pageYOffset + back.getBoundingClientRect().top
      scrollEnd = scrollStart + back.offsetHeight - main.offsetHeight
    }

    // Handle scroll event
    const handleScroll = function setElementsPosition1() {
      const scrollTop = window.scrollY

      // Scroll optimization
      if (scrollTop < scrollStart || scrollTop > scrollEnd + main.offsetHeight)
        return

      // handle fade gradient layer opacity
      if (scrollTop < scrollStart + SCROLL_OFFSET) {
        fade.style.opacity = `0`
      } else {
        fade.style.opacity = `${
          (scrollTop - scrollStart - SCROLL_OFFSET) /
          (scrollEnd - scrollStart - SCROLL_OFFSET)
        }`
      }
    }

    init()
    const throttledHandleScroll = throttle(handleScroll, 10)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', throttledHandleScroll)
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
            <div
              className="hs1-interact__sky"
              data-speedx="0"
              data-speedy="0"
              data-speedr="0"
            >
              <StaticImage
                imgSrc={skyImg}
                webpSrc={skyWebp}
                alt="푸른 하늘"
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
                alt="높고 가까운 구름"
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
                alt="중간 높이의 가까운 구름"
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
                alt="낮고 먼 구름"
                onLoad={handleImageLoad}
              />
            </div>
            <div
              className="hs1-interact__island"
              data-speedx="0.07"
              data-speedy="0.08"
              data-speedr="0.08"
            >
              <StaticImage
                imgSrc={islandImg}
                webpSrc={islandWebp}
                alt="멀리 있는 섬"
                onLoad={handleImageLoad}
              />
            </div>
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
                  alt="일렁이는 수평선의 푸른 바다"
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
                onLoad={handleImageLoad}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Transition Layer */}
      <div className="hs1-cover" ref={coverRef} onClick={handleClick}>
        {imagesLoaded === TOTAL_IMAGE ? (
          <div className="hs1-cover__phrase">
            <h1 tabIndex={0} onKeyDown={handleClick}>
              클릭하세요
            </h1>
            <h2>배경 음악이 재생됩니다</h2>
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