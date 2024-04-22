import React, { useCallback } from 'react'
import Joystick from '@/atoms/ui/Joystick'
import './JoystickControl.scss'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'

type JoystickControlProps = {
  controlsRef: React.RefObject<KeypadControls>
}

const JoystickControl = ({ controlsRef }: JoystickControlProps) => {
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
      <Joystick control={joystickControl} shoot={joystickShoot} jump={joystickJump} />
    </div>
  )
}

export default JoystickControl
