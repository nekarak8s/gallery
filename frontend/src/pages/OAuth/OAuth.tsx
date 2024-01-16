import React, { useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { routes } from '@/App'
import Loading from '@/atoms/ui/Loading'
import { useLoginCallback } from '@/features/member/services'

import './OAuth.scss'

function OAuth() {
  // get type ('kakao' | 'google')
  const { type } = useParams()

  // get OAuth code
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  // login callback
  const { mutate: loginCallback, isSuccess, isError } = useLoginCallback(type!, code!)

  useEffect(() => {
    loginCallback()
  }, [])

  // navigate according the result
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      const pathname = window.sessionStorage.getItem('login-pathname')
      if (pathname && pathname !== routes['Login'].path && pathname !== routes['Home'].path) {
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
