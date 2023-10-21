import React from 'react'
import { useLogin } from '@/features/members/services'
import WaveSvg from '@/assets/svgs/sin.svg'
import KakaoLogo from '@/assets/svgs/kakaotalk.svg'
import GalleryLogo from '@/assets/svgs/gallery-logo.svg'
import GoogleLogo from '@/assets/svgs/google.svg'

import './LoginForm.scss'
import Button3D from '@/atoms/ui/Button3D'

function LoginForm() {
  const { mutate: login } = useLogin()

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
          <Button3D
            onClick={() => login('kakao')}
            ariaLabel="카카오 아이디로 로그인하기"
          >
            <div className="login-form__menu-item">
              <KakaoLogo />
              <p>카카오 아이디로 탑승</p>
            </div>
          </Button3D>
        </li>
        <li>
          <Button3D
            onClick={() => login('google')}
            ariaLabel="구글 이메일로 로그인하기"
            disabled={true}
          >
            <div className="login-form__menu-item">
              <GoogleLogo />
              <p>구글 이메일로 탑승</p>
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
