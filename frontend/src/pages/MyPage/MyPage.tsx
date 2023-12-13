import React from 'react'
import GalleryList from '@/features/gallery/components/GalleryList/GalleryList'
import Profile from '@/features/member/components/Profile'
import ProfileEdit from '@/features/member/components/ProfileEdit'

import './MyPage.scss'

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
