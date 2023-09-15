import React from 'react'
import { useLogin } from '@/features/members/services'
import KakaoLogo from '@/assets/svgs/kakaotalk.svg'
import GalleryLogo from '@/assets/svgs/gallery-logo.svg'
import GoogleLogo from '@/assets/svgs/google.svg'

import styles from './LoginForm.module.scss'

function LoginForm() {
  const { mutate: login } = useLogin('kakao')

  return (
    <form className={styles.loginForm}>
      <h2 className={styles.loginFormLogo}>
        <GalleryLogo />
        <p>Open your 3D Exhibition</p>
      </h2>
      <ul className={styles.loginFormMenu}>
        <li className={styles.loginFormMenuItem} onClick={() => login()}>
          <KakaoLogo />
          <p>카카오 아이디로 로그인하기</p>
        </li>
        <li className={styles.loginFormMenuItem} onClick={() => login()}>
          <GoogleLogo />
          <p>구글 이메일로 로그인하기</p>
        </li>
      </ul>
      <div className={styles.loginFormPhrase}>
        <p>소셜 미디어로 손쉽게 로그인하세요</p>
      </div>
    </form>
  )
}

export default LoginForm
