import React, { useEffect, useRef, useState } from 'react'
import { useUserQuery } from '../../services'
import Loading from '@/atoms/ui/Loading'
import { userData } from '../../data'
import styles from './Profile.module.scss'
import image from '@/assets/images/ocean.png'

const COUNT_TIME = 3000 // ms

const Profile = () => {
  const durationRef = useRef<HTMLElement>(null)
  // const { data: user, isLoading, isError } = useUserQuery()
  const user = userData

  useEffect(() => {
    if (!user) return

    const duration = durationRef.current!

    let minutes = Math.floor(
      (new Date().getTime() - new Date(user.createdDate).getTime()) /
        (60 * 1000)
    )

    duration.textContent = minutes.toString()

    const intervalId = setInterval(() => {
      minutes += 1
      duration.textContent = minutes.toString()
    }, 60 * 1000)

    setTimeout(() => {
      document.querySelector('.my-page__profile')?.classList.add('loaded')
    }, 1000)

    setTimeout(() => {
      document.querySelector('.my-page__br')?.classList.add('opaque')
      document.querySelector('.my-page__profile__btn')?.classList.add('block')
      document.querySelector('.my-page__gallery')?.classList.add('block')
    }, 1500)

    return () => {
      intervalId && clearInterval(intervalId)
    }
  }, [user])

  // if (isLoading) {
  //   return <Loading />
  // }

  // if (isError) {
  //   return <div />
  // }

  return (
    <div className={styles.profile}>
      <span>{user.nickname}님의 작업실</span>
      <span>
        <span ref={durationRef}></span>분 운영 중
      </span>
    </div>
  )
}

export default Profile
