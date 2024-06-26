import React, { useEffect, useRef } from 'react'
import Fallback from '@/atoms/ui/Fallback'
import GalleryList from '@/features/gallery/components/GalleryList/GalleryList'
import Profile from '@/features/member/components/Profile'
import ProfileEdit from '@/features/member/components/ProfileEdit'
import { useUserQuery } from '@/features/member/services'
import './MyPage.scss'

function MyPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Get Data
  const { data: user, isLoading, isError } = useUserQuery()

  // Move scroll to the top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Start second animation when profile animation ended
  const handleAnimationEnd = function startSecondAnimation() {
    const container = containerRef.current
    if (!container) return

    container.classList.add('loaded')
  }

  if (isLoading) {
    return <Fallback />
  }

  if (isError) {
    return <div />
  }

  return (
    <div className="my-page" ref={containerRef}>
      <section className="my-page__profile" onAnimationEnd={handleAnimationEnd}>
        <Profile user={user} />
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
