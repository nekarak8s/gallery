import { useTranslation } from 'react-i18next'
import JumpIcon from '@/assets/svgs/jump.svg'
import useMobile from '@/hooks/useMobile'
import './JoystickControlNotice.scss'

const JoystickControlNotice = () => {
  const { t } = useTranslation()
  const isMobile = useMobile()

  return (
    <div className="joystick-control-notice">
      {isMobile ? (
        <ul>
          <li>
            <div className="joystick-control-notice__controller">
              <div></div>
            </div>
            <p> {t('joystickControl.move')}</p>
          </li>
          <li>
            <div className="joystick-control-notice__button">
              <JumpIcon />
            </div>
            <p> {t('joystickControl.jump')}</p>
          </li>
          <li>
            <div className="joystick-control-notice__shoot">
              <span />
              <span />
            </div>
            <p> {t('joystickControl.shoot')}</p>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <span>
              <kbd>&uarr;</kbd>&nbsp;
              <kbd>&darr;</kbd>&nbsp;
            </span>
            <p>{t('joystickControl.move')}</p>
          </li>
          <li>
            <span>
              <kbd>&larr;</kbd>&nbsp;
              <kbd>&rarr;</kbd>&nbsp;
            </span>
            <p>{t('joystickControl.rotate')}</p>
          </li>
          <li>
            <span>
              <kbd>Ctrl</kbd>&nbsp;
            </span>
            <p>{t('joystickControl.shoot')}</p>
          </li>
          <li>
            <span>
              <kbd>Alt</kbd>&nbsp;/&nbsp;<kbd>Opt</kbd>&nbsp;
            </span>
            <p>{t('joystickControl.jump')}</p>
          </li>
        </ul>
      )}
    </div>
  )
}

export default JoystickControlNotice
