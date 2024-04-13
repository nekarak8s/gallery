import { ChangeEventHandler, useEffect, useRef } from 'react'
import './Locale.scss'
import { useTranslation } from 'react-i18next'
import { CURSOR_SCALE } from '@/constants'
import i18n from '@/locales/i18next'

type LocaleProps = {
  isWhite: boolean
}

function Locale({ isWhite }: LocaleProps) {
  const { t } = useTranslation()
  const localeRef = useRef<HTMLLabelElement>(null)

  useEffect(() => {
    i18n.language === 'ko' && localeRef.current?.classList.remove('on')
    i18n.language === 'en' && localeRef.current?.classList.add('on')
  }, [])

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (localeRef.current) localeRef.current.classList.toggle('on')

    if (e.target.checked) {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('ko')
    }
  }
  return (
    <label className={`locale ${isWhite ? 'white' : ''}`} ref={localeRef} data-cursor-scale={CURSOR_SCALE}>
      <span className="locale__option">{t('locale.ko')}&nbsp;</span>
      <span className="locale__option">{t('locale.en')}</span>
      <span className="locale__slider" />
      <input type="checkbox" onChange={handleChange} />
    </label>
  )
}

export default Locale
