import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/atoms/ui/Button'
import MouseControls from '@/libs/three-custom/controls/MouseControls'
import './ButtonControl.scss'

type ButtonControlProps = {
  controlsRef: React.RefObject<MouseControls>
}

const ButtonControl = ({ controlsRef }: ButtonControlProps) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)

  const handleClickModal = useCallback(() => {
    if (!controlsRef.current) return
    setIsOpen(false)
    controlsRef.current.moveToNextPost()
  }, [controlsRef])

  const handleNextClick = useCallback(() => {
    if (!controlsRef.current) return
    controlsRef.current.moveToNextPost()
  }, [controlsRef])

  const handlePrevClick = useCallback(() => {
    if (!controlsRef.current) return
    controlsRef.current.moveToPrevPost()
  }, [controlsRef])

  return (
    <div className="button-control">
      {isOpen ? (
        <div className="button-control__modal">
          <Button size="lg" text={t('buttons.start')} onClick={handleClickModal} isTransparent={true} color="white" />
        </div>
      ) : (
        <div className="button-control__buttons">
          <Button size="lg" text={t('buttons.prev')} onClick={handlePrevClick} isTransparent={true} color="white" />
          <Button size="lg" text={t('buttons.next')} onClick={handleNextClick} isTransparent={true} color="white" />
        </div>
      )}
    </div>
  )
}

export default ButtonControl
