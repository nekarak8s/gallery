import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ButtonControlNotice from './ButtonControlNotice'
import Button from '@/atoms/ui/Button'
import useMobile from '@/hooks/useMobile'
import MouseControls from '@/libs/three-custom/controls/MouseControls'
import './ButtonControl.scss'

type ButtonControlProps = {
  controlsRef: React.RefObject<MouseControls>
}

const ButtonControl = ({ controlsRef }: ButtonControlProps) => {
  const { t } = useTranslation()
  const isMobile = useMobile()

  const [isOpen, setIsOpen] = useState(true)
  const [idx, setIdx] = useState(0)

  const handleClickModal = useCallback(() => {
    if (!controlsRef.current) return
    setIsOpen(false)
    controlsRef.current.moveToNextPost()
  }, [controlsRef])

  const handleNextClick = useCallback(() => {
    if (!controlsRef.current || controlsRef.current.isMoving) return
    setIdx((idx) => idx + 1)
    controlsRef.current.moveToNextPost()
  }, [controlsRef])

  const handlePrevClick = useCallback(() => {
    if (!controlsRef.current || controlsRef.current.isMoving) return
    setIdx((idx) => idx - 1)
    controlsRef.current.moveToPrevPost()
  }, [controlsRef])

  useEffect(() => {
    if (!controlsRef.current) return

    if (isMobile) {
      controlsRef.current.offsetDistance = 3.5
    } else {
      controlsRef.current.offsetDistance = 2.5
    }
  }, [controlsRef, isMobile])

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
          {idx + 1 !== controlsRef.current?.postTargets.length && (
            <Button size="lg" text={t('buttons.next')} onClick={handleNextClick} isTransparent={true} color="white" />
          )}
        </div>
      )}
    </div>
  )
}

export default ButtonControl
