import React, { useState } from 'react'
import { galleryItemData } from '../../data'
import Button from '@/atoms/ui/Button'
import CSSTransition from '@/atoms/ui/CSSTransition'
import './GalleryCover.scss'
import { CURSOR_SCALE } from '@/constants'

const GalleryCover = () => {
  // Get Data
  const gallery = galleryItemData

  const [isShow, setIsShow] = useState(true)
  console.log(isShow)

  return (
    <CSSTransition className="gallery-cover" isShow={isShow} duration={1300}>
      <div className="gallery-cover__envelop" tabIndex={0} data-cursor-scale={CURSOR_SCALE}>
        <div className="gallery-cover__envelop--back" data-cursor-scale={CURSOR_SCALE}></div>
        <div className="gallery-cover__envelop--left" data-cursor-scale={CURSOR_SCALE}></div>
        <div className="gallery-cover__envelop--right" data-cursor-scale={CURSOR_SCALE}></div>
        <div className="gallery-cover__envelop--bottom" data-cursor-scale={CURSOR_SCALE}></div>
        <div className="gallery-cover__envelop--top" data-cursor-scale={CURSOR_SCALE}></div>
        <div className="gallery-cover__envelop--top-inner" data-cursor-scale={CURSOR_SCALE}></div>
        <main className="gallery-cover__envelop--content">
          <h1>{gallery.name}</h1>
          <p>{gallery.content}</p>
          <Button text="입장하기" onClick={() => setIsShow(false)} direction="center" />
        </main>
      </div>
    </CSSTransition>
  )
}

export default GalleryCover
