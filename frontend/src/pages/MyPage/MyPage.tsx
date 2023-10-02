import React, { useEffect, useRef, useState } from 'react'

import './MyPage.scss'
import Profile from '@/features/members/components/Profile'
import Button from '@/atoms/ui/Button'
import GalleryList from '@/features/gallery/components/GalleryList/GalleryList'
import { useUserQuery } from '@/features/members/services'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import ProfileForm from '@/features/members/components/ProfileForm'

function MyPage() {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)

  return (
    <>
      <div className="my-page">
        <section className="my-page__profile">
          <Profile />
          <div className="my-page__profile__btn">
            <Button
              ariaLabel="닉네임 수정"
              text="닉네임 수정"
              onClick={() => setIsUpdateOpen(true)}
            />
          </div>
        </section>
        <div className="my-page__br" />
        <section className="my-page__gallery">
          <GalleryList />
        </section>
      </div>
      <Modal isOpen={isUpdateOpen} onClose={() => setIsUpdateOpen(false)}>
        <ProfileForm />
      </Modal>
    </>
  )
}

export default MyPage
