import React, { useEffect, useRef } from 'react'
import { throttle } from 'lodash'
import architectureImg from '@/assets/images/home-section-1/architecture.webp'
import forestImg from '@/assets/images/home-section-1/forest.webp'
import leftTreeImg from '@/assets/images/home-section-1/left-tree.webp'
import reflectionImg from '@/assets/images/home-section-1/reflection.webp'
import rightTreeImg from '@/assets/images/home-section-1/right-tree.webp'
import skyImg from '@/assets/images/home-section-1/sky.webp'

import './HomeSection1.scss'

function HomeSection1() {
  const backgroundRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const background = backgroundRef.current as HTMLDivElement
    const sticky = stickyRef.current as HTMLDivElement
    const parallexEles = document.querySelectorAll(
      '.parallax'
    ) as NodeListOf<HTMLElement>

    let scrollStart = 0
    let scrollEnd = 0
    const init = function setScrollEnds() {
      scrollStart = background.offsetTop
      scrollEnd =
        background.offsetTop + background.offsetHeight - sticky.offsetHeight
    }

    const handleScroll = function () {
      const scrollTop = window.scrollY

      if (scrollTop < scrollStart + 10) {
        window.addEventListener('mousemove', throttledHandleMouseMove)
        window.addEventListener('touchmove', throttledHandleMouseMove)
      } else {
        window.removeEventListener('mousemove', throttledHandleMouseMove)
        window.removeEventListener('touchmove', throttledHandleMouseMove)
      }

      parallexEles.forEach((el) => {
        const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)
        if (el.classList.contains('scroll-left')) {
          el.style.transform = `
          translate(calc(-50% - ${100 * factor}vw), -50%)
          `
        } else if (el.classList.contains('scroll-right')) {
          el.style.transform = `
          translate(calc(-50% + ${100 * factor}vw), -50%)
          `
        } else if (el.classList.contains('scroll-magnify')) {
          el.style.transform = `
          translate(-50% , -50%) translateZ(${3000 * factor * factor}px)
          `
        } else if (el.classList.contains('scroll-fade-in')) {
          el.style.opacity = `${factor * factor * factor * factor}`
        }
      })
    }

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
        const rotation = Number(el.dataset.rotation) * 2
        const layer = Number(el.dataset.layer) * 100

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

    const throttledHandleMouseMove = throttle(handleMouseMove, 10)
    const throttledHandleScroll = throttle(handleScroll, 10)
    window.addEventListener('resize', init)
    window.addEventListener('scroll', throttledHandleScroll)
    window.addEventListener('mousemove', throttledHandleMouseMove)
    window.addEventListener('touchmove', throttledHandleMouseMove)
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', throttledHandleScroll)
      window.removeEventListener('mousemove', throttledHandleMouseMove)
      window.removeEventListener('touchmove', throttledHandleMouseMove)
    }
  }, [])

  return (
    <div className="home-section-1" ref={backgroundRef}>
      <div className="home-section-1__main" ref={stickyRef}>
        <div className="white-fade parallax scroll-fade-in"></div>
        <div className="vignette"></div>
        <img
          className="home-section-1__sky-img parallax"
          data-speedx="0.2"
          data-speedy="0.25"
          data-speedz="0"
          data-rotation="0"
          data-layer="1"
          src={skyImg}
        ></img>
        <img
          className="home-section-1__forest-img parallax scroll-magnify"
          data-speedx="0.15"
          data-speedy="0.2"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="2"
          src={forestImg}
        ></img>
        <div
          className="home-section-1__gallery-logo parallax scroll-magnify"
          data-speedx="0.2"
          data-speedy="0.17"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="3"
        >
          <span className="preposition">The</span>
          Gallery
        </div>
        <img
          className="home-section-1__architecture-img parallax scroll-magnify"
          data-speedx="0.1"
          data-speedy="0.15"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="4"
          src={architectureImg}
        ></img>
        <img
          className="home-section-1__reflection-img parallax scroll-magnify"
          data-speedx="0.1"
          data-speedy="0.13"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="5"
          src={reflectionImg}
        ></img>
        <img
          className="home-section-1__left-tree-img parallax scroll-left"
          data-speedx="0.07"
          data-speedy="0.1"
          data-speedz="0.05"
          data-rotation="0.1"
          data-layer="6"
          src={leftTreeImg}
        ></img>
        <img
          className="home-section-1__right-tree-img parallax scroll-right"
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
