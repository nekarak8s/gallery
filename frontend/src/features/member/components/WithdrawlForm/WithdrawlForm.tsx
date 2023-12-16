import { useUserQuery, useWithdrawl } from '../../services'
import Form from '@/atoms/form/Form'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import toastManager from '@/utils/toastManager'

import './WithdrawlForm.scss'

type WithdrawlFormProps = {
  onSuccess?: () => void | undefined
  onError?: () => void | undefined
}

const WithdrawlForm = ({ onSuccess, onError }: WithdrawlFormProps) => {
  const { data: user, isLoading, isError } = useUserQuery()
  const { mutateAsync: withdraw } = useWithdrawl()

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    // validate data
    const formData = new FormData(e.currentTarget)
    const nickname = formData.get('nickname') as string
    if (nickname !== user?.nickname) {
      toastManager.addToast('error', '닉네임이 올바르지 않습니다')
      return
    }

    withdraw()
      .then(() => {
        onSuccess && onSuccess()
      })
      .catch(() => {
        onError && onError()
      })
  }

  if (isLoading) return <Loading />

  if (isError) return null

  return (
    <Form className="withdrawl-form" onSubmit={handleSubmit}>
      <p>
        본인의 닉네임 <b>{user?.nickname}</b>을 입력해주세요
      </p>
      <Text label="닉네임" name="nickname" initialValue="" />
      <Button text="회원 탈퇴" type="submit" />
    </Form>
  )
}

export default WithdrawlForm
