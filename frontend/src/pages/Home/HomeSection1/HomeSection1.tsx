import React, { useEffect, useRef, useState } from 'react'
import { throttle } from 'lodash'
import architectureImg from '@/assets/images/home-section-1/architecture.webp'
import forestImg from '@/assets/images/home-section-1/forest.webp'
import leftTreeImg from '@/assets/images/home-section-1/left-tree.webp'
import reflectionImg from '@/assets/images/home-section-1/reflection.webp'
import rightTreeImg from '@/assets/images/home-section-1/right-tree.webp'
import skyImg from '@/assets/images/home-section-1/sky.webp'

import styles from './HomeSection1.module.scss'

const LAYER_DEPTH = 50 // css 3d-preserve depth multiplication factor

function HomeSection1() {
  // element refs
  const backgroundRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // get the elements
    const background = backgroundRef.current as HTMLDivElement
    const sticky = stickyRef.current as HTMLDivElement
    const logo = logoRef.current as HTMLDivElement
    const parallexEles = Array.from(
      document.querySelector(`.${styles.main}`)
        ?.children as HTMLCollectionOf<HTMLElement>
    )

    // init the data
    let scrollStart = 0
    let scrollEnd = 0
    const logoPosition = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    }
    const init = function setInitialPositionData1() {
      const backgroundTop =
        window.pageYOffset + background.getBoundingClientRect().top
      scrollStart = backgroundTop
      scrollEnd = backgroundTop + background.offsetHeight - sticky.offsetHeight

      logoPosition.top = Number(getComputedStyle(logo).top.replace('px', ''))
      logoPosition.right = Number(
        getComputedStyle(logo).right.replace('px', '')
      )
      logoPosition.bottom = Number(
        getComputedStyle(logo).bottom.replace('px', '')
      )
      logoPosition.left = Number(getComputedStyle(logo).left.replace('px', ''))
    }

    // move elements according to scroll position
    let hasListener = false
    const handleScroll = function setElementsPosition1() {
      const scrollTop = window.scrollY
      const backgroundBottom =
        window.pageYOffset + background.getBoundingClientRect().bottom

      if (backgroundBottom < scrollTop) return

      // whether to move elements
      if (scrollTop < scrollStart + 300) {
        !hasListener &&
          window.addEventListener('mousemove', throttledHandleMouseMove)
        hasListener = true
        logo.style.transition = `transform 0.45s cubic-bezier(0.2, 0.49, 0.32, 0.99)`
        return
      }

      hasListener &&
        window.removeEventListener('mousemove', throttledHandleMouseMove)
      hasListener = false
      logo.style.transition = `transform 0s linear`

      const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)
      // move elements
      parallexEles.forEach((el) => {
        const layer = Number(el.dataset.layer) * LAYER_DEPTH
        if (el.classList.contains('scroll-down')) {
          el.style.transform = `
          translate(-50%, calc(-50% + ${factor * 80}px + ${
            factor * 4
          }vh )) translateZ(${layer}px)
          `
        } else if (el.classList.contains('scroll-left')) {
          el.style.transform = `
          translate(calc(-50% - ${100 * factor}vw), -50%) translateZ(${layer}px)
          `
        } else if (el.classList.contains('scroll-right')) {
          el.style.transform = `
          translate(calc(-50% + ${100 * factor}vw), -50%) translateZ(${layer}px)
          `
        } else if (el.classList.contains('scroll-magnify-center')) {
          el.style.top = `
          ${(1 - factor) * logoPosition.top}px
          `
          el.style.right = `
          ${(1 - factor) * logoPosition.right}px
          `
          el.style.bottom = `
          ${(1 - factor) * logoPosition.bottom}px
          `
          el.style.left = `
          ${(1 - factor) * logoPosition.left}px
          `
          el.style.transform = `
          translate(-${(1 - factor) * 50}%, -${
            (1 - factor) * 50
          }%) translateZ(${2500 * factor * factor + layer}px)  
          `
          el.style.zIndex = `
          ${Math.floor(2 * factor)}
          `
        } else if (el.classList.contains('scroll-fade-in')) {
          el.style.opacity = `${factor * factor * factor * factor}`
        }
      })
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

        el.style.transform = `rotateY(${
          rotateDeg * rotation
        }deg) translate(calc(-50% + ${xValue * speedx}px), calc(-50% + ${
          yValue * speedy
        }px)) translateZ(${zValue * speedz + layer}px)`
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
        <div className={styles.vignette}></div>
        <div className={`${styles.whiteFade} scroll-fade-in`}></div>
        <img
          className={styles.skyImg}
          data-speedx="0.2"
          data-speedy="0.25"
          data-speedz="0"
          data-rotation="0"
          data-layer="1"
          src={skyImg}
        ></img>
        <img
          className={`${styles.forestImg} scroll-down`}
          data-speedx="0.13"
          data-speedy="0.2"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="2"
          src={forestImg}
        ></img>
        <div
          className={`${styles.galleryLogo} scroll-magnify-center`}
          data-speedx="0.15"
          data-speedy="0.17"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="3"
          ref={logoRef}
        >
          {/* <span className="preposition">The</span> */}
          <span>Gallery</span>
        </div>
        <img
          className={`${styles.architectureImg} scroll-down`}
          data-speedx="0.1"
          data-speedy="0.15"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="4"
          src={architectureImg}
        ></img>
        <img
          className={`${styles.reflectionImg} scroll-down`}
          data-speedx="0.1"
          data-speedy="0.12"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="5"
          src={reflectionImg}
        ></img>
        <img
          className={`${styles.leftTreeImg} scroll-left`}
          data-speedx="0.07"
          data-speedy="0.1"
          data-speedz="0.05"
          data-rotation="0.1"
          data-layer="6"
          src={leftTreeImg}
        ></img>
        <img
          className={`${styles.rightTreeImg} scroll-right`}
          data-speedx="0.07"
          data-speedy="0.1"
          data-speedz="0.05"
          data-rotation="0.1"
          data-layer="7"
          src={rightTreeImg}
        ></img>
      </div>
    </div>
  )
}

export default HomeSection1
