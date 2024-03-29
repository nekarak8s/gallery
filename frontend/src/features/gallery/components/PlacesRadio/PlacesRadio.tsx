import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PlaceData } from '../../types'
import ImageIcon from '@/assets/svgs/image.svg'
import LeftArrow from '@/assets/svgs/left-arrow.svg'
import RightArrow from '@/assets/svgs/right-arrow.svg'
import Radio from '@/atoms/form/Radio'
import { CURSOR_SCALE } from '@/constants'
import './PlacesRadio.scss'

type PlaceRadioProps = {
  placeList: PlaceData[]
  showSelected?: boolean
  defaultChecked?: number | undefined
}

const PlacesRadio = ({ placeList, defaultChecked }: PlaceRadioProps) => {
  const [index, setIndex] = useState<number>(0)
  const length = useMemo(() => {
    return placeList.length
  }, [placeList])

  /**
   * Set the first Index
   */
  useEffect(() => {
    if (!defaultChecked) {
      setIndex(0)
    }

    for (let idx = 0; idx < placeList.length; idx++) {
      if (placeList[idx].placeId === defaultChecked) {
        setIndex(idx)
        break
      }
    }
  }, [placeList, defaultChecked])

  /**
   * Slide to the previous carousel item
   */
  const onClickPrev: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      setIndex((index) => {
        const prevIndex = (index - 1) % length
        return prevIndex < 0 ? prevIndex + length : prevIndex
      })
    },
    [length]
  )

  /**
   * Slide to the next carousel item
   */
  const onClickNext: MouseEventHandler = useCallback(
    (e) => {
      e.preventDefault()
      setIndex((index) => {
        return (index + 1) % length
      })
    },
    [length]
  )

  /**
   * Animation according to the index
   */
  const containerRef = useRef<HTMLDivElement>(null)
  const isFirstLoad = useRef(true)

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false
      return
    }

    const labels = containerRef.current!.querySelectorAll('label')

    labels.forEach((label) => {
      label.style.transform = `translateX(-${index * 100}%)`
    })

    //  Bug : Click radio button after the slide animation is ended, otherwise the slides are positioned inadequately
    setTimeout(() => {
      labels[index].click()
    }, 300)
  }, [index])

  return (
    <>
      <div className="places-radio">
        <button
          className="places-radio__left"
          type="button"
          onClick={onClickPrev}
          data-cursor-scale={CURSOR_SCALE}
          aria-label="이전 갤러리 공간 타입 선택"
        >
          <LeftArrow />
        </button>
        <div className="places-radio__container" ref={containerRef}>
          {placeList.map((place, index) => (
            <Radio
              key={place.placeId}
              id={`place-${place.placeId}`}
              name="placeId"
              label={place.name}
              value={place.placeId}
              flexDirection="column"
              defaultChecked={defaultChecked ? defaultChecked === place.placeId : index === 0}
            >
              <img src={place.threeDimensionImageUri} alt={`${place.name} 공간`} />
            </Radio>
          ))}
        </div>
        <button
          className="places-radio__right"
          type="button"
          onClick={onClickNext}
          data-cursor-scale={CURSOR_SCALE}
          aria-label="다음 갤러리 공간 타입 선택"
        >
          <RightArrow />
        </button>
        <div className="places-radio__image">
          <button type="button" aria-label="갤러리 2D 이미지 열기">
            <ImageIcon />
          </button>
          <img src={placeList[index].twoDimensionImageUri} />
        </div>
      </div>
    </>
  )
}

export default PlacesRadio
