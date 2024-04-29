import { useTranslation } from 'react-i18next'
import ClickIcon from '@/assets/svgs/click.svg'
import DragIcon from '@/assets/svgs/drag-touch.svg'
import './ButtonControlNotice.scss'

const ButtonControlNotice = () => {
  const { t } = useTranslation()

  return (
    <div className="button-control-notice">
      <ul>
        <li>
          <div className="button-control-notice__button">{t('buttons.button')}</div>
          <p> {t('buttonControl.button')}</p>
        </li>
        <li>
          <ClickIcon />
          <p> {t('buttonControl.click')}</p>
        </li>
        <li>
          <DragIcon />
          <p> {t('buttonControl.drag')}</p>
        </li>
      </ul>
    </div>
  )
}

export default ButtonControlNotice
