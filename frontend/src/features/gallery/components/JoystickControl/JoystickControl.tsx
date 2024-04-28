import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/atoms/ui/Button'
import Joystick from '@/atoms/ui/Joystick'
import useMobile from '@/hooks/useMobile'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import './JoystickControl.scss'

type JoystickControlProps = {
  controlsRef: React.RefObject<KeypadControls>
}

const JoystickControl = ({ controlsRef }: JoystickControlProps) => {
  const isMobile = useMobile()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)

  const joystickControl = useCallback(
    (x: number, y: number) => {
      if (!controlsRef.current) return
      controlsRef.current.rotateSpeedRatio = x
      controlsRef.current.moveSpeedRatio = -y
    },
    [controlsRef]
  )

  const joystickShoot = useCallback(() => {
    if (!controlsRef.current) return
    controlsRef.current.raycastTargets()
  }, [controlsRef])

  const joystickJump = useCallback(() => {
    if (!controlsRef.current) return
    controlsRef.current.jump()
  }, [controlsRef])

  return (
    <div className="joystick-control">
      {isOpen ? (
        <div className="button-control__modal">
          <Button size="lg" text={t('buttons.start')} onClick={() => setIsOpen(false)} isTransparent={true} color="white" />
        </div>
      ) : (
        isMobile && <Joystick control={joystickControl} shoot={joystickShoot} jump={joystickJump} />
      )}
    </div>
  )
}

export default JoystickControl
