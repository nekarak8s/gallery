import Button from '@/atoms/ui/Button'
import Button3D from '@/atoms/ui/Button3D'
import Modal from '@/atoms/ui/Modal'
import ProfileForm from '@/features/members/components/ProfileForm'
import { useState, useRef, useEffect } from 'react'
import { useLogout } from '../../services'

import './ProfileEdit.scss'
import WithdrawlForm from '../WithdrawlForm'

const ProfileEdit = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current!

    const handleMouseEnter = function addOpenClass() {
      container.classList.add('open')
    }

    const handleMouseLeave = function addOpenClass() {
      container.classList.remove('open')
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isWithdrawlOpen, setIsWithdrawlOpen] = useState(false)

  const { mutate: logout } = useLogout()

  return (
    <div className="profile-edit" ref={containerRef}>
      <div className="profile-edit__menu">
        <Button
          ariaLabel="정보수정"
          text="닉네임 수정"
          onClick={() => setIsUpdateOpen(true)}
        />
        <Button ariaLabel="로그아웃" text="로그아웃" onClick={() => logout()} />
        <Button
          ariaLabel="회원탈퇴"
          text="회원탈퇴"
          onClick={() => setIsWithdrawlOpen(true)}
        />
      </div>
      <Button3D ariaLabel="더보기">
        <div className="profile-edit__toggle">
          <span />
          <span />
          <span />
        </div>
      </Button3D>
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
        <ProfileForm />
      </Modal>
      <Modal isOpen={isWithdrawlOpen} onClose={() => setIsWithdrawlOpen(false)}>
        <WithdrawlForm />
      </Modal>
    </div>
  )
}

export default ProfileEdit
