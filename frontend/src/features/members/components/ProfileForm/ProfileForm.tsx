import Button from '@/atoms/ui/Button'
import React, { useState } from 'react'
import './ProfileForm.scss'
import Input from '@/atoms/form/Input'
import WaveIcon from '@/assets/svgs/wave.svg'

const ProfileForm: React.FC = () => {
  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
  }
  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {/* <h2>프로필 수정</h2> */}
      {/* <WaveIcon /> */}
      <Input label="닉네임" initialValue="" />
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
