import { useEffect, useRef, MouseEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { CURSOR_SCALE } from '@/constants'
import i18n from '@/locales/i18next'
import './Locale.scss'

type LocaleProps = {
  isWhite: boolean
}

function Locale({ isWhite }: LocaleProps) {
  const { t } = useTranslation()
  const localeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    i18n.language === 'ko' && localeRef.current?.classList.remove('on')
    i18n.language === 'en' && localeRef.current?.classList.add('on')
  }, [])

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    const localeButton = localeRef.current
    if (!localeButton) return

    if (i18n.language === 'ko') {
      localeButton.classList.add('on')
      i18n.changeLanguage('en')
    } else {
      localeButton.classList.remove('on')
      i18n.changeLanguage('ko')
    }
  }
  return (
    <button className={`locale ${isWhite ? 'white' : ''}`} ref={localeRef} onClick={handleClick} data-cursor-scale={CURSOR_SCALE}>
      <span className="locale__option">{t('locale.ko')}&nbsp;</span>
      <span className="locale__option">{t('locale.en')}</span>
    </button>
  )
}

export default Locale
