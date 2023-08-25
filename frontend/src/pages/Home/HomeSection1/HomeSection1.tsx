import React, { useEffect } from 'react'
import './HomeSection1.scss'

import skyImg from '@/assets/images/home-section-1/sky.webp'
import forestImg from '@/assets/images/home-section-1/forest.webp'
import architectureImg from '@/assets/images/home-section-1/architecture.webp'
import reflectionImg from '@/assets/images/home-section-1/reflection.webp'
import leftTreeImg from '@/assets/images/home-section-1/left-tree.webp'
import rightTreeImg from '@/assets/images/home-section-1/right-tree.webp'
import { throttle } from 'lodash'

function HomeSection1() {
  useEffect(() => {
    const parallexEles = document.querySelectorAll(
      '.parallax'
    ) as NodeListOf<HTMLElement>

    const handleMouseMove = function (e: MouseEvent) {
      const xValue = e.clientX - window.innerWidth / 2
      const yValue = e.clientY - window.innerHeight / 2

      const rotateDeg = (xValue / (window.innerWidth / 2)) * 20

      parallexEles.forEach((el) => {
        const speedx = Number(el.dataset.speedx)
        const speedy = Number(el.dataset.speedy)
        const speedz = Number(el.dataset.speedz)
        const rotation = Number(el.dataset.rotation) * 2
        const layer = Number(el.dataset.layer) * 100

        const leftX = parseFloat(getComputedStyle(el).left)
        const isInLeft = leftX < window.innerHeight / 2 ? 1 : -1
        const zValue = e.clientX - leftX * isInLeft * 0.1

        // console.log(xValue, yValue)
        el.style.transform = `rotateY(${rotateDeg * rotation}deg) translate3d(${
          xValue * speedx
        }px, ${yValue * speedy}px, ${zValue * speedz + layer}px)`
      })
    }

    const throttledHandleMouseMove = throttle(handleMouseMove, 10)
    window.addEventListener('mousemove', throttledHandleMouseMove)
    // window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', throttledHandleMouseMove)
      // window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="home-section-1">
      <div className="home-section-1__main">
        <div className="vignette"></div>
        <img
          className="home-section-1__sky-img parallax"
          data-speedx="0.2"
          data-speedy="0.2"
          data-speedz="0"
          data-rotation="0"
          data-layer="1"
          src={skyImg}
        ></img>
        <img
          className="home-section-1__forest-img parallax"
          data-speedx="0.15"
          data-speedy="0.15"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="2"
          src={forestImg}
        ></img>
        <div
          className="home-section-1__gallery-logo parallax"
          data-speedx="0.12"
          data-speedy="0.12"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="3"
        >
          Gallery
        </div>
        <img
          className="home-section-1__architecture-img parallax"
          data-speedx="0.1"
          data-speedy="0.1"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="4"
          src={architectureImg}
        ></img>
        <img
          className="home-section-1__reflection-img parallax"
          data-speedx="0.1"
          data-speedy="0.1"
          data-speedz="0"
          data-rotation="0.1"
          data-layer="5"
          src={reflectionImg}
        ></img>
        <img
          className="home-section-1__left-tree-img parallax"
          data-speedx="0.05"
          data-speedy="0.05"
          data-speedz="0.05"
          data-rotation="0.1"
          data-layer="6"
          src={leftTreeImg}
        ></img>
        <img
          className="home-section-1__right-tree-img parallax"
          data-speedx="0.05"
          data-speedy="0.05"
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
