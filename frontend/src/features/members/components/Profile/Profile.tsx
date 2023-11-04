import React, { useEffect, useRef, useState } from 'react'
import { useUserQuery } from '../../services'
import Loading from '@/atoms/ui/Loading'
import { userData } from '../../data'
import './Profile.scss'
import image from '@/assets/images/ocean.png'

interface ProfileProps {
  onLoaded?: () => void
}

const Profile = ({ onLoaded }: ProfileProps) => {
  // const { data: user, isLoading, isError } = useUserQuery()
  const user = userData

  /**
   * Handle loaded data
   * 1. Set duration: minutes from the created date
   * 2. Run onLoaded function
   */
  const [duration, setDuration] = useState(0)
  useEffect(() => {
    if (!user) return

    // Init duration
    setDuration(
      Math.floor(
        (new Date().getTime() - new Date(user.createdDate).getTime()) /
          (60 * 1000)
      )
    )

    // Set time interval on evenry minute
    const intervalId = setInterval(() => {
      setDuration((duration) => duration + 1)
    }, 60 * 1000)

    // Run onLoaded function
    onLoaded && onLoaded()

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
    <div className="profile">
      <span>{user.nickname}님의 작업실</span>
      <span>
        <span>{duration}</span>분 운영 중
      </span>
    </div>
  )
}

export default Profile
