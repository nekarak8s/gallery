import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ButtonControlNotice from './ButtonControlNotice'
import Button from '@/atoms/ui/Button'
import useMobile from '@/hooks/useMobile'
import MouseControls from '@/libs/three-custom/controls/MouseControls'
import './ButtonControl.scss'

type ButtonControlProps = {
  controls: MouseControls
}

const ButtonControl = ({ controls }: ButtonControlProps) => {
  const { t } = useTranslation()
  const isMobile = useMobile()

  const [isOpen, setIsOpen] = useState(true)
  const [idx, setIdx] = useState(0)

  const handleClickModal = useCallback(() => {
    setIsOpen(false)
    controls.moveToNextPost()
  }, [controls])

  const handleNextClick = useCallback(() => {
    setIdx((idx) => idx + 1)
    controls.moveToNextPost()
  }, [controls])

  const handlePrevClick = useCallback(() => {
    setIdx((idx) => idx - 1)
    controls.moveToPrevPost()
  }, [controls])

  useEffect(() => {
    if (isMobile) {
      controls.offsetDistance = 3.5
    } else {
      controls.offsetDistance = 2.5
    }
  }, [controls, isMobile])

  return (
    <div className="button-control">
      {isOpen ? (
        <div className="button-control__modal">
          <ButtonControlNotice />
          <Button size="lg" text={t('buttons.start')} onClick={handleClickModal} isTransparent={true} color="white" />
        </div>
      ) : (
        <div className="button-control__buttons">
          {idx !== 0 && <Button size="lg" text={t('buttons.prev')} onClick={handlePrevClick} isTransparent={true} color="white" />}
          {idx + 1 !== controls.postTargets.length && (
            <Button size="lg" text={t('buttons.next')} onClick={handleNextClick} isTransparent={true} color="white" />
          )}
        </div>
      )}
    </div>
  )
}

export default ButtonControl
