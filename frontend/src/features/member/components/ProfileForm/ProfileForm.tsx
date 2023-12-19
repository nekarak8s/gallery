import { useUpdateUser } from '../../services'
import { validateProfileForm } from '../../validators'
import Form from '@/atoms/form/Form'
import Input from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import toastManager from '@/utils/toastManager'
import './ProfileForm.scss'

type ProfileFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

const ProfileForm = ({ onSuccess, onError }: ProfileFormProps) => {
  const { mutateAsync: update, isLoading } = useUpdateUser()

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    e.stopPropagation()

    // validate data
    const form = e.currentTarget
    const formData = new FormData(form)
    const result = validateProfileForm(formData)

    if (!result.result) {
      toastManager.addToast('error', `${result.reason}`)
      return
    }

    update(result.data)
      .then(() => {
        form.reset()
        onSuccess && onSuccess()
      })
      .catch(() => {
        onError && onError()
      })
  }

  return (
    <>
      <Form className="profile-form" onSubmit={handleSubmit}>
        <Input label="닉네임" name="nickname" initialValue="" />
        <Button type="submit" direction="left" ariaLabel="닉네임 수정" text="수정하기" />
      </Form>
      {isLoading && (
        <div className="profile-form__loading">
          <Loading />
        </div>
      )}
    </>
  )
}

export default ProfileForm
