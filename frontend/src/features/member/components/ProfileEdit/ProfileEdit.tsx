import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '../../services'
import WithdrawlForm from '../WithdrawlForm'
import { routes } from '@/App'
import KebabIcon from '@/assets/svgs/kebab.svg'
import Button from '@/atoms/ui/Button'
import Button3D from '@/atoms/ui/Button3D'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Modal from '@/atoms/ui/Modal'
import ProfileForm from '@/features/member/components/ProfileForm'
import './ProfileEdit.scss'

const ProfileEdit = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  /**
   * Logout
   */
  const { mutateAsync: logout } = useLogout()

  const handleLogout = () => {
    logout().then(() => {
      navigate(routes['Home'].path)
    })
  }

  /**
   * Profile Update
   */
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  /**
   * Withdraw
   */
  const [isWithdrawlOpen, setIsWithdrawlOpen] = useState(false)

  /**
   * Show edit buttons when container is hovered
   */
  const containerRef = useRef<HTMLDivElement>(null)
  const [isButtonsShow, setIsButtonsShow] = useState<boolean>(false)

  useEffect(() => {
    const container = containerRef.current!

    const handleMouseEnter = function addOpenClass() {
      setIsButtonsShow(true)
    }

    const handleMouseLeave = function addOpenClass() {
      setIsButtonsShow(false)
    }

    container.addEventListener('mouseenter', handleMouseEnter)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div className="profile-edit" ref={containerRef}>
      <Button3D ariaLabel="메뉴 더보기" onFocus={() => setIsButtonsShow(true)}>
        <div className="profile-edit__toggle">
          <KebabIcon />
        </div>
      </Button3D>
      <CSSTransition className="profile-edit__menu" isShow={isButtonsShow} duration={200} timingFunction="ease-in-out">
        <Button ariaLabel="닉네임 수정" text={t('buttons.nickname')} direction="right" onClick={() => setIsUpdateOpen(true)} />
        <Button ariaLabel="로그아웃" text={t('buttons.logout')} direction="center" onClick={handleLogout} />
        <Button
          ariaLabel="회원탈퇴"
          text={t('buttons.withdraw')}
          direction="bottom"
          color="red"
          onClick={() => setIsWithdrawlOpen(true)}
          onBlur={() => setIsButtonsShow(false)}
        />
      </CSSTransition>
      {/* Proifle Update Modal */}
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
        <ProfileForm onSuccess={() => setIsUpdateOpen(false)} />
      </Modal>
      {/* Withdrawl Modal */}
      <Modal isOpen={isWithdrawlOpen} onClose={() => setIsWithdrawlOpen(false)}>
        <WithdrawlForm
          onSuccess={() => {
            setIsWithdrawlOpen(false)
            navigate(routes['Home'].path)
          }}
        />
      </Modal>
    </div>
  )
}

export default ProfileEdit
