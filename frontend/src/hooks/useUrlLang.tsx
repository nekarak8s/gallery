import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from '@/locales/i18next'

/**
 * Change language by URL query string ('lang')
 */
function useUrlLang() {
  const { search } = useLocation()

  useEffect(() => {
    const params = new URLSearchParams(search)
    const lang = params.get('lang')

    if (lang) i18n.changeLanguage(lang)
  }, [search])
}

export default useUrlLang
