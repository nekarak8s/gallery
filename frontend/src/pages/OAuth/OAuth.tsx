import React, { useEffect } from 'react'

import './OAuth.scss'
import { useLoginCb } from '@/features/members/services'
import { useParams, useSearchParams } from 'react-router-dom'

function OAuth() {
  const { type } = useParams()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  console.log(type, code)
  const { mutate: loginCb } = useLoginCb(type as string, code as string)

  useEffect(() => {
    loginCb()
  }, [])

  return <div className="oauth">OAuth</div>
}

export default OAuth
