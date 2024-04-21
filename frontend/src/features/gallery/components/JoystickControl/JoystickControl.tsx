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
      controlsRef.current!.rotateSpeedRatio = x
      controlsRef.current!.moveSpeedRatio = -y
    },
    [controlsRef.current]
  )

  const joystickShoot = useCallback(() => {
    controlsRef.current!.raycastTargets()
  }, [controlsRef.current])

  const joystickJump = useCallback(() => {
    controlsRef.current!.jump()
  }, [controlsRef.current])

  return (
    <div className="joystick-control">
      <Joystick control={joystickControl} shoot={joystickShoot} jump={joystickJump} />
    </div>
  )
}

export default JoystickControl
