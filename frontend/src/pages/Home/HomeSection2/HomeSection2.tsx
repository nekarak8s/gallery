import React, { useEffect, useRef } from 'react'
import MediaCard from './MediaCard'
import posterImg from '@/assets/images/home-section-2/cloud-poster.jpg?format=jpg'
import posterWebp from '@/assets/images/home-section-2/cloud-poster.jpg?format=webp'
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
import toFrame from '@/libs/toFrame'

import './HomeSection2.scss'

const BACK_HEIGHT = 6 // * 100vh. background height

function HomeSection2() {
  /**
   * Set the background height
   */
  const backRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const back = backRef.current!

    back.style.setProperty('--height-back', `${BACK_HEIGHT * 100}vh`)
    back.style.setProperty('--min-height-back', `${BACK_HEIGHT * 600}px`)
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
    const cardEles = Array.from(cards.children as HTMLCollectionOf<HTMLDivElement>)

    // Initiate scroll data & card position
    let scrollStart = 0
    let scrollEnd = 0
    const init = function initiateHS2ScrollData() {
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

    // Move card elements according to scroll
    const handleScroll = function moveHS2Cards() {
      const scrollTop = window.scrollY

      // Scroll optimization
      if (scrollTop < scrollStart || scrollTop > scrollEnd + main.offsetHeight) {
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
    const optimizedHandleScroll = toFrame(handleScroll)

    window.addEventListener('resize', init)
    window.addEventListener('scroll', optimizedHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('resize', init)
      window.removeEventListener('scroll', optimizedHandleScroll)
    }
  }, [])

  return (
    <div className="hs2-back" ref={backRef}>
      <div className="hs2-main" ref={mainRef}>
        <div className="hs2-phrase" ref={phraseRef}>
          <p data-speedy="0" style={{ zIndex: 8 }}>
            하루 수백 장의 사진을 찍고
          </p>
          <p data-speedy="0" style={{ zIndex: 2 }}>
            하루 수백 장의 사진이 쌓여갑니다
          </p>
          <p data-speedy="0" style={{ zIndex: 5 }}>
            그렇게 우리를 스쳐 지나갑니다
          </p>
        </div>
        <div ref={cardsRef}>
          <div
            className="hs2-card"
            data-posx="0.1"
            data-posy="1.7"
            data-speedy="1.1"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                type="video"
                alt="바다로 여행을 떠나는 클립"
                vidSrc={wideVid1}
                webmSrc={wideWebm1}
                width="clamp(230px, 40vw, 500px)"
                height="clamp(173px, 30vw, 375px)"
                sizes="(max-width: 650px) 230px, (max-width: 1250px) 40vw, 500px"
                description="Trip to the ocean"
                depth={5}
                date="2012.10.09"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.15"
            data-posy="3.3"
            data-speedy="1.05"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                type="video"
                alt="기차 타고 캠핑하다가 노 젓는 클립"
                vidSrc={wideVid2}
                webmSrc={wideWebm2}
                width="clamp(230px, 40vw, 500px)"
                height="clamp(173px, 30vw, 375px)"
                sizes="(max-width: 650px) 230px, (max-width: 1250px) 40vw, 500px"
                description="Rainy day travel"
                depth={5}
                date="2021.05.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.2"
            data-posy="4.4"
            data-speedy="1.07"
            style={{ zIndex: 4 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                type="video"
                alt="축구복 시착하고 강아지가 일어서는 클립"
                vidSrc={narrowVid1}
                webmSrc={narrowWebm1}
                width="clamp(188px, 25vw, 375px)"
                height="clamp(250px, 33.3vw, 500px)"
                sizes="(max-width: 750px) 188px, (max-width: 1500px) 15vw, 375px"
                description="Just clips"
                depth={4}
                date="2017.03.28"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.01"
            data-posy="1.5"
            data-speedy="0.7"
            style={{ zIndex: 2 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="햇빛드는 카페 테라스"
                imgSrc={narrowImg1}
                webpSrc={narrowWebp1}
                width="clamp(150px, 20vw, 300px)"
                height="clamp(200px, 26.7vw, 400px)"
                sizes="(max-width: 750px) 150px, (max-width: 1500px) 20vw, 300px"
                description="Cafeteria"
                depth={2}
                date="2022.03.07"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.3"
            data-posy="1.35"
            data-speedy="0.6"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="야자수 뒤의 핑크빛 하늘"
                imgSrc={narrowImg2}
                webpSrc={narrowWebp2}
                width="clamp(113px, 15vw, 225px)"
                height="clamp(151px, 20vw, 300px)"
                sizes="(max-width: 750px) 113px, (max-width: 1500px) 15vw, 225px"
                description="Pink Sky"
                depth={1}
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.1"
            data-posy="2.7"
            data-speedy="0.9"
            style={{ zIndex: 4 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="엄마와 딸 팔뚝 위에 바디페인팅"
                imgSrc={narrowImg3}
                webpSrc={narrowWebp3}
                width="clamp(188px, 25vw, 375px)"
                height="clamp(250px, 33.3vw, 500px)"
                sizes="(max-width: 750px) 188px, (max-width: 1500px) 15vw, 375px"
                description="Mom & Daughter"
                depth={4}
                date="2023.08.05"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.1"
            data-posy="2"
            data-speedy="0.7"
            style={{ zIndex: 2 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="눈 덮인 지붕"
                imgSrc={narrowImg4}
                webpSrc={narrowWebp4}
                width="clamp(151px, 20vw, 300px)"
                height="clamp(201px, 26.7vw, 400px)"
                sizes="(max-width: 750px) 151px, (max-width: 1500px) 20vw, 300px"
                description="snow doesn't melt"
                depth={2}
                date="2021.09.12"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.32"
            data-posy="3.3"
            data-speedy="0.9"
            style={{ zIndex: 3 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="두 잔의 라떼 아트"
                imgSrc={narrowImg5}
                webpSrc={narrowWebp5}
                width="clamp(166px, 22vw, 330px)"
                height="clamp(215px, 29.3vw, 440px)"
                sizes="(max-width: 750px) 166px, (max-width: 1500px) 22vw, 330px"
                description="Coffee in Japan"
                depth={3}
                date="2023.04.22"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.1"
            data-posy="4.8"
            data-speedy="1.2"
            style={{ zIndex: 5 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="강아지 포스터"
                imgSrc={narrowImg6}
                webpSrc={narrowWebp6}
                width="clamp(226px, 30vw, 450px)"
                height="clamp(301px, 40vw, 600px)"
                sizes="(max-width: 750px) 226px, (max-width: 1500px) 30vw, 450px"
                description="The Dog Poster"
                depth={5}
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.03"
            data-posy="2.6"
            data-speedy="0.59"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="색연필 묶음"
                imgSrc={narrowImg7}
                webpSrc={narrowWebp7}
                width="clamp(113px, 15vw, 225px)"
                height="clamp(151px, 20vw, 300px)"
                sizes="(max-width: 750px) 113px, (max-width: 1500px) 15vw, 225px"
                description="Colors"
                depth={1}
                date="2023.05.08"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.25"
            data-posy="1.4"
            data-speedy="0.5"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="노을이 지는 바다"
                imgSrc={wideImg1}
                webpSrc={wideWebp1}
                width="clamp(103px, 18vw, 225px)"
                height="clamp(77px, 11vw, 113px)"
                sizes="(max-width: 650px) 103px, (max-width: 1250px) 18vw, 225px"
                description="Suset & Sea"
                depth={1}
                date="2020.09.01"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.08"
            data-posy="3.1"
            data-speedy="1.25"
            style={{ zIndex: 7 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="패러글라이딩 의상을 입은 가족"
                imgSrc={wideImg2}
                webpSrc={wideWebp2}
                width="clamp(287px, 50vw, 500px)"
                height="clamp(215px, 37.5vw, 375px)"
                sizes="(max-width: 650px) 287px, (max-width: 1250px) 50vw, 500px"
                description="My loving family"
                depth={7}
                date="2020.07.27"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="-0.2"
            data-posy="2.2"
            data-speedy="0.61"
            style={{ zIndex: 2 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="담요 위에서 잠자는 고양이"
                imgSrc={wideImg3}
                webpSrc={wideWebp3}
                width="clamp(114px, 20vw, 250px)"
                height="clamp(86px, 15vw, 188px)"
                sizes="(max-width: 650px) 114px, (max-width: 1250px) 20vw, 250px"
                description="Sleeping cat"
                depth={2}
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.07"
            data-posy="2.1"
            data-speedy="0.5"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="비행기에서 내려다 본 구름"
                imgSrc={wideImg4}
                webpSrc={wideWebp4}
                width="clamp(103px, 18vw, 225px)"
                height="clamp(77px, 11vw, 113px)"
                sizes="(max-width: 650px) 103px, (max-width: 1250px) 18vw, 225px"
                description="Cloud Ocean"
                depth={1}
                date="2021.01.03"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.4"
            data-posy="2.3"
            data-speedy="0.5"
            style={{ zIndex: 1 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="페퍼로니 피자"
                imgSrc={wideImg5}
                webpSrc={wideWebp5}
                width="clamp(103px, 18vw, 225px)"
                height="clamp(77px, 11vw, 113px)"
                sizes="(max-width: 650px) 103px, (max-width: 1250px) 18vw, 225px"
                description="Yummy Pizza"
                depth={1}
                date="2019.10.21"
              />
            </div>
          </div>
          <div
            className="hs2-card"
            data-posx="0.01"
            data-posy="2.1"
            data-speedy="0.9"
            style={{ zIndex: 3 }}
          >
            <div className="hs2-card__item">
              <MediaCard
                alt="바다 위에 떠다니는 배"
                imgSrc={wideImg6}
                webpSrc={wideWebp6}
                width="clamp(173px, 30vw, 375px)"
                height="clamp(130px, 22.5vw, 281px)"
                sizes="(max-width: 650px) 173px, (max-width: 1250px) 30vw, 375px"
                description="Busan Ocean"
                depth={3}
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
                width="clamp(226px, 40vw, 500px)"
                height="clamp(301px, 53vw, 667px)"
                sizes="(max-width: 452px) 226px, (max-width: 1250px) 40vw, 500px"
                description="The cloud poster"
                depth={10}
                date="2019.10.21"
              />
              <div className="hs2-card__phrase">
                With the development of mobile devices, it is easy to take pictures, but the value
                of a picture is decreasing. There are hundreds of pictures on the album, but most of
                them are pictures that you don&apos;t even know when they were taken. When was the
                last time you remembered with your friends while looking at the picture?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeSection2
