import React from 'react'

import MouseSvg from '@/assets/svgs/mouse.svg'
import DownArrowSvg from '@/assets/svgs/down-arrow.svg'

import './scrollDown.scss'

const ScrollDown = () => {
  return (
    <div className="scroll-down">
      <MouseSvg />
      <DownArrowSvg />
    </div>
  )
}

export default ScrollDown
