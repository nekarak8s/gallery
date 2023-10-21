import React from 'react'
import { useUserQuery, useWithdrawl } from '../../services'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'

const WithdrawlForm = () => {
  const { data: user, isLoading, isError } = useUserQuery()
  const { mutate: withdraw } = useWithdrawl()

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // validate data
    const formData = new FormData(e.currentTarget)
    const nickname = formData.get('nickname') as string

    if (nickname == user?.nickname) {
      withdraw()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>본인의 닉네임 {user?.nickname}을 따라 입력해주세요</p>
      <Text label="닉네임" name="nickname" initialValue="" />
      <Button text="회원 탈퇴" type="submit" />
    </form>
  )
}

export default WithdrawlForm
