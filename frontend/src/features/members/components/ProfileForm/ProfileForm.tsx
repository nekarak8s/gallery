import { useUpdateProfile } from '../../services'
import { validateProfileForm } from '../../validators'
import Input from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import toastManager from '@/utils/toastManager'

import './ProfileForm.scss'

const ProfileForm = () => {
  const { mutate: update } = useUpdateProfile()

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // validate data
    const formData = new FormData(e.currentTarget)
    const result = validateProfileForm(formData)

    if (!result.result) {
      toastManager.addToast('error', '닉네임을 제대로 입력하쇼', 2000)
    } else {
      update(result.data)
    }
  }
  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {/* <h2>프로필 수정</h2> */}
      {/* <WaveIcon /> */}
      <Input label="닉네임" name="nickname" initialValue="" />
      <Button
        type="submit"
        direction="left"
        ariaLabel="닉네임 수정"
        text="수정하기"
      />
    </form>
  )
}

export default ProfileForm
