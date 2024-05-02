import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import JoystickControlNotice from './JoystickControlNotice'
import Button from '@/atoms/ui/Button'
import Joystick from '@/atoms/ui/Joystick'
import useMobile from '@/hooks/useMobile'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import { MichelleBuilder } from '@/libs/three-custom/items/Player'
import './JoystickControl.scss'

type JoystickControlProps = {
  controlsRef: React.RefObject<KeypadControls>
  loadingManager: THREE.LoadingManager
}

const JoystickControl = ({ controlsRef, loadingManager }: JoystickControlProps) => {
  const isMobile = useMobile()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return

    MichelleBuilder.build(new GLTFLoader(loadingManager))
      .then((michelle) => {
        controls.character = michelle
      })
      .catch((err) => {
        console.error(err)
      })
  }, [controlsRef])

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
        <div className="joystick-control__modal">
          <JoystickControlNotice />
          <Button size="lg" text={t('buttons.start')} onClick={() => setIsOpen(false)} isTransparent={true} color="white" />
        </div>
      ) : (
        <div className="joystick-control__controller">
          {isMobile && <Joystick control={joystickControl} shoot={joystickShoot} jump={joystickJump} />}
        </div>
      )}
    </div>
  )
}

export default JoystickControl
