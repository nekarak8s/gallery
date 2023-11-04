import React, { useEffect, useRef, useState } from 'react'

import './MyPage.scss'
import Profile from '@/features/members/components/Profile'
import Button from '@/atoms/ui/Button'
import GalleryList from '@/features/gallery/components/GalleryList/GalleryList'
import { useUserQuery } from '@/features/members/services'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import ProfileForm from '@/features/members/components/ProfileForm'
import ProfileEdit from '@/features/members/components/ProfileEdit'

function MyPage() {
  const onProfileLoaded = function () {
    document.querySelector('.my-page__profile')?.classList.add('loaded')
  }

  const handleAnimationEnd = function startSecondAnimation() {
    document.querySelector('.my-page__profile-edit')?.classList.add('block')
    document.querySelector('.my-page__line')?.classList.add('block')
    document.querySelector('.my-page__gallery')?.classList.add('block')
  }

  return (
    <div className="my-page">
      <section className="my-page__profile" onAnimationEnd={handleAnimationEnd}>
        <Profile onLoaded={onProfileLoaded} />
        <div className="my-page__profile-edit">
          <ProfileEdit />
        </div>
      </section>
      <div className="my-page__line" />
      <section className="my-page__gallery">
        <GalleryList />
      </section>
    </div>
  )
}

export default MyPage
