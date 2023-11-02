import React, { useEffect } from 'react'

import { routes } from '@/App'
import './OAuth.scss'
import { useLoginCallback } from '@/features/members/services'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Loading from '@/atoms/ui/Loading'
import path from 'path'

function OAuth() {
  // get type ('kakao' | 'google')
  const { type } = useParams()

  // get OAuth code
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  // login callback
  const {
    mutate: loginCallback,
    isSuccess,
    isError,
  } = useLoginCallback(type!, code!)

  useEffect(() => {
    loginCallback()
  }, [])

  // navigate according the result
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      const pathname = window.sessionStorage.getItem('login-pathname')
      console.log('pathname', pathname)
      if (pathname && pathname !== routes['Login'].path) {
        navigate(pathname)
      } else {
        navigate(routes['MyPage'].path)
      }
    }

    if (isError) {
      navigate(routes['Login'].path)
    }
  }, [isSuccess, isError])

  return (
    <div className="oauth">
      <Loading />
    </div>
  )
}

export default OAuth
