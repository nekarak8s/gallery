import React, { useEffect, useRef } from 'react'
import throttle from 'lodash/throttle'
import narrowImg1 from '@/assets/images/home-section-2/narrow-1.jpg?format=jpg'
import narrowWebp1 from '@/assets/images/home-section-2/narrow-1.jpg?format=webp'
import narrowImg2 from '@/assets/images/home-section-2/narrow-2.jpg?format=jpg'
import narrowWebp2 from '@/assets/images/home-section-2/narrow-2.jpg?format=webp'
import narrowImg3 from '@/assets/images/home-section-2/narrow-3.jpg?format=jpg'
import narrowWebp3 from '@/assets/images/home-section-2/narrow-3.jpg?format=webp'
import narrowImg4 from '@/assets/images/home-section-2/narrow-4.jpg?format=jpg'
import narrowWebp4 from '@/assets/images/home-section-2/narrow-4.jpg?format=webp'
import narrowImg5 from '@/assets/images/home-section-2/narrow-5.jpg?format=jpg'
import narrowWebp5 from '@/assets/images/home-section-2/narrow-5.jpg?format=webp'
import narrowImg6 from '@/assets/images/home-section-2/narrow-6.jpg?format=jpg'
import narrowWebp6 from '@/assets/images/home-section-2/narrow-6.jpg?format=webp'
import narrowImg7 from '@/assets/images/home-section-2/narrow-7.jpg?format=jpg'
import narrowWebp7 from '@/assets/images/home-section-2/narrow-7.jpg?format=webp'
import wideImg1 from '@/assets/images/home-section-2/wide-1.jpg?format=jpg'
import wideWebp1 from '@/assets/images/home-section-2/wide-1.jpg?format=webp'
import wideImg2 from '@/assets/images/home-section-2/wide-2.jpg?format=jpg'
import wideWebp2 from '@/assets/images/home-section-2/wide-2.jpg?format=webp'
import wideImg3 from '@/assets/images/home-section-2/wide-3.jpg?format=jpg'
import wideWebp3 from '@/assets/images/home-section-2/wide-3.jpg?format=webp'
import wideImg4 from '@/assets/images/home-section-2/wide-4.jpg?format=jpg'
import wideWebp4 from '@/assets/images/home-section-2/wide-4.jpg?format=webp'
import wideImg5 from '@/assets/images/home-section-2/wide-5.jpg?format=jpg'
import wideWebp5 from '@/assets/images/home-section-2/wide-5.jpg?format=webp'
import wideImg6 from '@/assets/images/home-section-2/wide-6.jpg?format=jpg'
import wideWebp6 from '@/assets/images/home-section-2/wide-6.jpg?format=webp'
import wideVid1 from '@/assets/videos/home-video-1.mp4'
import wideWebm1 from '@/assets/videos/home-video-1.webm'
import wideVid2 from '@/assets/videos/home-video-2.mp4'
import wideWebm2 from '@/assets/videos/home-video-2.webm'
import narrowVid1 from '@/assets/videos/home-video-3.mp4'
import narrowWebm1 from '@/assets/videos/home-video-3.webm'
import posterImg from '@/assets/images/home-section-2/cloud-poster.jpg?format=jpg'
import posterWebp from '@/assets/images/home-section-2/cloud-poster.jpg?format=webp'

import MediaCard from './MediaCard'
import './HomeSection2.scss'

const BACK_HEIGHT = 8 // * 100vh. background height

const ASPECT_RATIO = {
  wide: {
    width: 'clamp(230px, 40vw, 500px)',
    height: 'clamp(172px, 30vw, 375px)',
  },
  square: {
    width: 'clamp(250px, 30vw, 600px)',
    height: 'clamp(250px, 30vw, 600px)',
  },
  narrow: {
    width: 'clamp(300px, 30vw, 600px)',
    height: 'clamp(400px, 40vw, 800px)',
  },
}

function HomeSection2() {
  /**
   * Set the background height
   */
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const back = backRef.current!

    back.style.setProperty('--back-height', `${BACK_HEIGHT * 100}vh`)
    back.style.setProperty('--back-min-height', `${BACK_HEIGHT * 600}px`)
  }, [])

  /**
   * Scroll Event Hadling
   * 1. Toggle phrase opacity
   * 2. Move card elements
   * 3. Open card elements
   */
  const mainRef = useRef<HTMLDivElement>(null)
  const phraseRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const back = backRef.current!
    const main = mainRef.current!
    const phrase = phraseRef.current!
    const cards = cardsRef.current!
    const cardEles = Array.from(
      cards.children as HTMLCollectionOf<HTMLDivElement>
    )

    // Initiate scroll data & card position
    let scrollStart = 0
    let scrollEnd = 0
    const init = function setInitialPositionData2() {
      // Initiate scroll data
      scrollStart = window.pageYOffset + back.getBoundingClientRect().top
      scrollEnd = scrollStart + back.offsetHeight - main.offsetHeight

      // Initiate card position
      cardEles.forEach((el) => {
        const posx = Number(el.dataset.posx)
        const posy = Number(el.dataset.posy)
        if (posx < 0) {
          el.style.right = `${-100 * posx}vw`
        } else {
          el.style.left = `${100 * posx}vw`
        }
        el.style.top = `${100 * posy}vh`
      })
    }

    // Move media elements according to scrool
    const handleScroll = function setElementsPosition2() {
      const scrollTop = window.scrollY

      // Scroll optimization
      if (
        scrollTop < scrollStart ||
        scrollTop > scrollEnd + main.offsetHeight
      ) {
        phrase.classList.remove('opaque')
        return
      }

      // Toggle phrase opacity
      phrase.classList.add('opaque')

      // Move card elements
      const factor = (scrollTop - scrollStart) / (scrollEnd - scrollStart)
      cardEles.forEach((el) => {
        const speedy = Number(el.dataset.speedy)
        el.style.transform = `translateY(
          calc(-50% - ${factor * (BACK_HEIGHT * 100 - 100) * speedy}vh)
          )`

        // Open the card
        if (el.getBoundingClientRect().top < window.innerHeight * 1.1) {
          el.classList.add('open')
        }
      })
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
    <div className="hs2-back" ref={backRef}>
      <div className="hs2-main" ref={mainRef}>
        <div className="hs2-phrase" ref={phraseRef}>
          <p data-speedy="0" style={{ zIndex: 8 }}>
            하루에 몇 장의 사진을 찍고
          </p>
          <p data-speedy="0" style={{ zIndex: 2 }}>
            하루에 몇 장을 기억에 담고
          </p>
          <p data-speedy="0" style={{ zIndex: 5 }}>
            하루에 몇 번을 공유 하나요
          </p>
        </div>
        <div ref={cardsRef}>
          <div
            className="hs2-card"
            data-posx="0.1"
            data-posy="1.5"
            data-speedy="1"
            style={{ zIndex: 3 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                type="video"
                alt="바다로 여행을 떠나는 클립"
                vidSrc={wideVid1}
                webmSrc={wideWebm1}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Trip to the ocean"
                date="2012.10.09"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.18"
            data-posy="4.1"
            data-speedy="1"
            style={{ zIndex: 9 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                type="video"
                alt="기차 타고 캠핑하다가 노 젓는 클립"
                vidSrc={wideVid2}
                webmSrc={wideWebm2}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Rainy day travel"
                date="2021.05.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.1"
            data-posy="6.5"
            data-speedy="1.05"
            style={{ zIndex: 6 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                type="video"
                alt="축구복 시착하고 강아지가 일어서는 클립"
                vidSrc={narrowVid1}
                webmSrc={narrowWebm1}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="Just clips"
                date="2017.03.28"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.01"
            data-posy="1.9"
            data-speedy="0.9"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="햇빛드는 카페 테라스"
                imgSrc={narrowImg1}
                webpSrc={narrowWebp1}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="Peaceful Cafeteria"
                date="2022.03.07"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.4"
            data-posy="2.9"
            data-speedy="1.25"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="야자수 뒤의 핑크빛 하늘"
                imgSrc={narrowImg2}
                webpSrc={narrowWebp2}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="Pink Sky"
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.2"
            data-posy="4.8"
            data-speedy="1.5"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="엄마와 딸 팔뚝 위에 바디페인팅"
                imgSrc={narrowImg3}
                webpSrc={narrowWebp3}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="Mom & Daughter"
                date="2023.08.05"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.1"
            data-posy="4.3"
            data-speedy="1.12"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="눈 덮인 지붕"
                imgSrc={narrowImg4}
                webpSrc={narrowWebp4}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="snow doesn't melt"
                date="2021.09.12"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.02"
            data-posy="6.3"
            data-speedy="1.2"
            style={{ zIndex: 7 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="두 잔의 라떼 아트"
                imgSrc={narrowImg5}
                webpSrc={narrowWebp5}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="Coffee in Japan"
                date="2023.04.22"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.16"
            data-posy="6.2"
            data-speedy="1.1"
            style={{ zIndex: 8 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="강아지 포스터"
                imgSrc={narrowImg6}
                webpSrc={narrowWebp6}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="The Dog Poster"
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.01"
            data-posy="5"
            data-speedy="1"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="색연필 묶음"
                imgSrc={narrowImg7}
                webpSrc={narrowWebp7}
                width={ASPECT_RATIO.narrow.width}
                height={ASPECT_RATIO.narrow.height}
                description="New color pencils"
                date="2023.05.08"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.01"
            data-posy="3.3"
            data-speedy="1.1"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="노을이 지는 바다"
                imgSrc={wideImg1}
                webpSrc={wideWebp1}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Suset over the sea"
                date="2020.09.01"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.08"
            data-posy="3.9"
            data-speedy="1.37"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="패러글라이딩 의상을 입은 가족"
                imgSrc={wideImg2}
                webpSrc={wideWebp2}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="My loving family"
                date="2020.07.27"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.01"
            data-posy="6"
            data-speedy="1.3"
            style={{ zIndex: 4 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="담요 위에서 잠자는 고양이"
                imgSrc={wideImg3}
                webpSrc={wideWebp3}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Sleeping cat"
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.3"
            data-posy="4.5"
            data-speedy="0.9"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="비행기에서 내려다 본 구름"
                imgSrc={wideImg4}
                webpSrc={wideWebp4}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Cloud Ocean"
                date="2021.01.03"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.03"
            data-posy="7.5"
            data-speedy="1.2"
            style={{ zIndex: 2 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="페퍼로니 피자"
                imgSrc={wideImg5}
                webpSrc={wideWebp5}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Yummy Pizza"
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.01"
            data-posy="2.2"
            data-speedy="0.95"
            style={{ zIndex: 2 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="바다 위에 떠다니는 배"
                imgSrc={wideImg6}
                webpSrc={wideWebp6}
                width={ASPECT_RATIO.wide.width}
                height={ASPECT_RATIO.wide.height}
                description="Busan Ocean"
                date="2017.11.09"
              />
            </div>
          </div>
          <div
            className="hs2-card hs2-card--last"
            data-posx="-0.001"
            data-posy={BACK_HEIGHT - 0.9}
            data-speedy="1"
            style={{ zIndex: 10 }}
          >
            <div className="hs2-card__item">
              <div className="hs2-card__blank"></div>
              <MediaCard
                alt="The cloud poster"
                imgSrc={posterImg}
                webpSrc={posterWebp}
                width="clamp(190px, 50vw, 350px)"
                height="clamp(304px, 70vw, 490px)"
                description="The cloud poster"
                date="2019.10.21"
              />
              <div className="hs2-card__phrase">
                모바일 기기의 발전은 사진 촬영을 용이하게 만들었지만, 어떤
                쟁점을 불러오기도 했다. 오늘날 개별 사진들은 저마다 고유한
                의미를 잃은 것처럼 보인다. 이제 우리는 사진을 순간의 기록이
                아니라 소셜 미디어에 공유하기 위한 자료 또는 단순한 기억의
                파편으로 바라본다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection2
