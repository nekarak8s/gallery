import React from 'react'
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
  const location = useLocation()
  const { mutate: login } = useLogin()

  const handleClick = function saveUrlLogin(type: string) {
    window.sessionStorage.setItem('login-pathname', location.pathname) // 로그인 후 리다이렉트 결정 : OAuth.tsx
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
        <p>더 갤러리 호가 출발합니다</p>
      </div>
      <ul className="login-form__menu">
        <li>
          <Button3D onClick={() => handleClick('kakao')} ariaLabel="카카오 아이디로 로그인하기">
            <div data-cursor-scale={CURSOR_SCALE} className="login-form__menu-item">
              <KakaoLogo />
              <p data-cursor-scale={CURSOR_SCALE}>카카오 아이디로 탑승</p>
            </div>
          </Button3D>
        </li>
        <li>
          <Button3D onClick={() => handleClick('google')} ariaLabel="구글 이메일로 로그인하기">
            <div className="login-form__menu-item">
              <GoogleLogo />
              <p data-cursor-scale={CURSOR_SCALE}>구글 이메일로 탑승</p>
            </div>
          </Button3D>
        </li>
      </ul>
      <div className="login-form__comment">
        <p>소셜 미디어로 안전하게 로그인하세요</p>
      </div>
    </form>
  )
}

export default LoginForm
