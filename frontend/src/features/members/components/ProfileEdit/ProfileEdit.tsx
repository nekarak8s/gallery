import { useState, useRef, useEffect } from 'react'
import { useLogout } from '../../services'
import WithdrawlForm from '../WithdrawlForm'
import KebabIcon from '@/assets/svgs/kebab.svg'
import Button from '@/atoms/ui/Button'
import Button3D from '@/atoms/ui/Button3D'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Modal from '@/atoms/ui/Modal'
import ProfileForm from '@/features/members/components/ProfileForm'

import './ProfileEdit.scss'

const ProfileEdit = () => {
  /**
   * Show Menu buttons when container is hovered
   */
  const containerRef = useRef<HTMLDivElement>(null)
  const [isShow, setIsShow] = useState<boolean>(false)

  useEffect(() => {
    const container = containerRef.current!

    const handleMouseEnter = function addOpenClass() {
      setIsShow(true)
    }

    const handleMouseLeave = function addOpenClass() {
      setIsShow(false)
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Modal state
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isWithdrawlOpen, setIsWithdrawlOpen] = useState(false)

  // Logout
  const { mutate: logout } = useLogout()

  return (
    <div className="profile-edit" ref={containerRef}>
      <Button3D ariaLabel="더보기" onFocus={() => setIsShow(true)}>
        <div className="profile-edit__toggle">
          <KebabIcon />
        </div>
      </Button3D>
      <CSSTransition
        className="profile-edit__menu"
        isShow={isShow}
        duration={200}
        timingFunction="ease-in-out"
      >
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
          onBlur={() => setIsShow(false)}
        />
      </CSSTransition>
      {/* Modal */}
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
