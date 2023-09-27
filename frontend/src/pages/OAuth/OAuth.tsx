import React, { useEffect } from 'react'

import './OAuth.scss'
import { useLoginCallback } from '@/features/members/services'
import { useParams, useSearchParams } from 'react-router-dom'
import Loading from '@/atoms/ui/Loading'

function OAuth() {
  const { type } = useParams()

  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')

  const { mutate: loginCallback } = useLoginCallback(
    type as string,
    code as string
  )

  useEffect(() => {
    loginCallback()
  }, [])

  return (
    <div className="oauth">
      <Loading />
    </div>
  )
}

export default OAuth
