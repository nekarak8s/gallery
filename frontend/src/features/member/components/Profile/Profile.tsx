import { useEffect, useState } from 'react'
import './Profile.scss'
import { UserData } from '../../types'

interface ProfileProps {
  user: UserData
}

const Profile = ({ user }: ProfileProps) => {
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
      Math.floor((new Date().getTime() - new Date(user.createdDate).getTime()) / (60 * 1000))
    )

    // Set time interval on evenry minute
    const intervalId = setInterval(() => {
      setDuration((duration) => duration + 1)
    }, 60 * 1000)

    return () => {
      intervalId && clearInterval(intervalId)
    }
  }, [user])

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
