import { useTranslation } from 'react-i18next'
import JumpIcon from '@/assets/svgs/jump.svg'
import useMobile from '@/hooks/useMobile'
import './ControlNotice.scss'

const ControlNotice = () => {
  const { t } = useTranslation()
  const isMobile = useMobile()

  return (
    <div className="control-notice">
      {isMobile ? (
        <ul>
          <li>
            <div className="control-notice__controller">
              <div></div>
            </div>
            <p> {t('galleryNav.move')}</p>
          </li>
          <li>
            <div className="control-notice__button">
              <JumpIcon />
            </div>
            <p> {t('galleryNav.jump')}</p>
          </li>
          <li>
            <div className="control-notice__shoot">
              <span />
              <span />
            </div>
            <p> {t('galleryNav.shoot')}</p>
          </li>
        </ul>
      ) : (
        <ul>
          <li>
            <p>
              <kbd>&uarr;</kbd>&nbsp;
              <kbd>&darr;</kbd>&nbsp; : {t('galleryNav.move')}
            </p>
          </li>
          <li>
            <p>
              <kbd>&larr;</kbd>&nbsp;
              <kbd>&rarr;</kbd>&nbsp; : {t('galleryNav.rotate')}
            </p>
          </li>
          <li>
            <p>
              <kbd>Ctrl</kbd>&nbsp; : {t('galleryNav.shoot')}
            </p>
          </li>
          <li>
            <p>
              <kbd>Alt</kbd>&nbsp;/&nbsp;<kbd>Opt</kbd>&nbsp; : {t('galleryNav.jump')}
            </p>
          </li>
        </ul>
      )}
    </div>
  )
}

export default ControlNotice
