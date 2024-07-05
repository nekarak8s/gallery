import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import JoystickControlNotice from './JoystickControlNotice'
import FemaleSvg from '@/assets/svgs/female.svg'
import MaleSvg from '@/assets/svgs/male.svg'
import Button from '@/atoms/ui/Button'
import Joystick from '@/atoms/ui/Joystick'
import { CURSOR_SCALE } from '@/constants'
import useMobile from '@/hooks/useMobile'
import KeypadControls from '@/libs/three-custom/controls/KeypadControls'
import { MichelleBuilder } from '@/libs/three-custom/items/Player'
import { VanguardBuilder } from '@/libs/three-custom/items/Player/characters/Vanguard'
import { IPlayer } from '@/libs/three-custom/items/Player/Player'
import './JoystickControl.scss'

type JoystickControlProps = {
  controls: KeypadControls
  loadingManager: THREE.LoadingManager
}

type CharacterType = 'Michelle' | 'Vanguard'

const changeCharacter = async (type: CharacterType, controls: KeypadControls, loadingManager?: THREE.LoadingManager) => {
  let character: IPlayer
  switch (type) {
    case 'Michelle':
      character = await MichelleBuilder.build(new GLTFLoader(loadingManager))
      break
    case 'Vanguard':
      character = await VanguardBuilder.build(new GLTFLoader(loadingManager))
      break
    default:
      character = await MichelleBuilder.build(new GLTFLoader(loadingManager))
      break
  }
  controls.character = character
}

const JoystickControl = ({ controls, loadingManager }: JoystickControlProps) => {
  const isMobile = useMobile()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(true)
  const [curType, setCurType] = useState<CharacterType>('Michelle' as CharacterType)

  useEffect(() => {
    changeCharacter('Michelle', controls, loadingManager)
    setCurType('Michelle')
  }, [controls])

  const joystickControl = useCallback(
    (x: number, y: number) => {
      controls.rotateSpeedRatio = x
      controls.moveSpeedRatio = -y
    },
    [controls]
  )

  const joystickShoot = useCallback(() => {
    controls.raycastTargets()
  }, [controls])

  const joystickJump = useCallback(() => {
    controls.jump()
  }, [controls])

  const handleCharacterClick = useCallback(
    (type: CharacterType) => {
      if (type === curType) return

      changeCharacter(type, controls)
      setCurType(type)
    },
    [curType]
  )

  return (
    <div className="joystick-control">
      {isOpen ? (
        <div className="joystick-control__modal">
          <JoystickControlNotice />
          <Button size="lg" text={t('buttons.start')} onClick={() => setIsOpen(false)} isTransparent={true} color="white" />
        </div>
      ) : (
        <div className="joystick-control__container">
          <div className="joystick-control__buttons">
            <button
              onClick={() => handleCharacterClick('Michelle')}
              className={`${curType === 'Michelle' ? 'selected' : ''}`}
              data-cursor-scale={CURSOR_SCALE}
            >
              <FemaleSvg />
            </button>
            <button
              onClick={() => handleCharacterClick('Vanguard')}
              className={`${curType === 'Vanguard' ? 'selected' : ''}`}
              data-cursor-scale={CURSOR_SCALE}
            >
              <MaleSvg />
            </button>
          </div>
          {isMobile && (
            <div className="joystick-control__controller">
              <Joystick control={joystickControl} shoot={joystickShoot} jump={joystickJump} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JoystickControl
