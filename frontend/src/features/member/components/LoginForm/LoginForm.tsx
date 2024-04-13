import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import GalleryLogo from '@/assets/svgs/gallery-logo.svg'
import GoogleLogo from '@/assets/svgs/google.svg'
import KakaoLogo from '@/assets/svgs/kakaotalk.svg'
import WaveSvg from '@/assets/svgs/sin.svg'
import Button3D from '@/atoms/ui/Button3D'
import { CURSOR_SCALE } from '@/constants'
import { useLogin } from '@/features/member/services'

import './LoginForm.scss'

function LoginForm() {
  const { t } = useTranslation()

  /**
   * 로그인 후 리다이렉트 결정 : OAuth.tsx
   */
  const location = useLocation()
  const { mutate: login } = useLogin()

  const handleClick = function saveUrlLogin(type: string) {
    window.sessionStorage.setItem('login-pathname', location.pathname)
    login(type)
  }

  return (
    <form className="login-form">
      <div className="login-form__header">
        <GalleryLogo />
        <div className="login-form__wave">
          <WaveSvg />
          <WaveSvg />
        </div>
        <p>{t('login.title')}</p>
      </div>
      <ul className="login-form__menu">
        <li>
          <Button3D onClick={() => handleClick('kakao')} ariaLabel="카카오 아이디로 로그인하기">
            <div data-cursor-scale={CURSOR_SCALE} className="login-form__menu-item">
              <KakaoLogo />
              <p data-cursor-scale={CURSOR_SCALE}>{t('login.kakao')}</p>
            </div>
          </Button3D>
        </li>
        <li>
          <Button3D onClick={() => handleClick('google')} ariaLabel="구글 이메일로 로그인하기">
            <div className="login-form__menu-item">
              <GoogleLogo />
              <p data-cursor-scale={CURSOR_SCALE}>{t('login.google')}</p>
            </div>
          </Button3D>
        </li>
      </ul>
      <div className="login-form__comment">
        <p>{t('login.description')}</p>
      </div>
    </form>
  )
}

export default LoginForm
