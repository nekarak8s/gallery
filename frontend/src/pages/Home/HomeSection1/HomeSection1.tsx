import React, { useEffect } from 'react'
import './HomeSection1.scss'

import skyImg from '@/assets/images/home-section-1/sky.png'
import forestImg from '@/assets/images/home-section-1/forest.png'
import architectureImg from '@/assets/images/home-section-1/architecture.png'
import leftTreeImg from '@/assets/images/home-section-1/left-tree.png'
import rightTreeImg from '@/assets/images/home-section-1/right-tree.png'
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
        const rotation = Number(el.dataset.rotation)

        const leftX = parseFloat(getComputedStyle(el).left)
        const isInLeft = leftX < window.innerHeight / 2 ? 1 : -1
        const zValue = e.clientX - leftX * isInLeft * 0.1

        // console.log(xValue, yValue)
        el.style.transform = `rotateY(${
          rotateDeg * rotation * 2
        }deg) translate3d(${xValue * speedx}px, ${yValue * speedy}px, ${
          zValue * speedz
        }px)`
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
          data-speedx="0.3"
          data-speedy="0.3"
          data-speedz="0.3"
          data-rotation="0.3"
          src={skyImg}
        ></img>
        <img
          className="home-section-1__forest-img parallax"
          data-speedx="0.25"
          data-speedy="0.25"
          data-speedz="0.25"
          data-rotation="0.25"
          src={forestImg}
        ></img>
        <div
          className="home-section-1__gallery-logo parallax"
          data-speedx="0.25"
          data-speedy="0.25"
          data-speedz="0.25"
          data-rotation="0.25"
        >
          Gallery
        </div>
        <img
          className="home-section-1__architecture-img parallax"
          data-speedx="0.2"
          data-speedy="0.2"
          data-speedz="0.2"
          data-rotation="0.2"
          src={architectureImg}
        ></img>
        <img
          className="home-section-1__left-tree-img parallax"
          data-speedx="0.1"
          data-speedy="0.1"
          data-speedz="0.1"
          data-rotation="0.1"
          src={leftTreeImg}
        ></img>
        <img
          className="home-section-1__right-tree-img parallax"
          data-speedx="0.1"
          data-speedy="0.1"
          data-speedz="0.1"
          data-rotation="0.1"
          src={rightTreeImg}
        ></img>
      </div>
    </div>
  )
}

export default HomeSection1
