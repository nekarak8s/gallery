import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserData } from '../../types'
import { elapsedTimeFromDate } from '@/libs/date'
import './Profile.scss'

interface ProfileProps {
  user: UserData
}

const Profile = ({ user }: ProfileProps) => {
  const { t } = useTranslation()

  /**
   * Handle loaded data
   * 1. Set duration: minutes from the created date
   * 2. Run onLoaded function
   */
  const [duration, setDuration] = useState(0)
  const durationDate: TDate = useMemo(() => elapsedTimeFromDate(duration), [duration])

  useEffect(() => {
    if (!user) return

    // Init duration
    setDuration(Math.floor(new Date().getTime() - new Date(user.createdDate).getTime()))

    // Set time interval on evenry minute
    const intervalId = setInterval(() => {
      setDuration((duration) => duration + 1000)
    }, 1000)

    return () => {
      intervalId && clearInterval(intervalId)
    }
  }, [user])

  return (
    <div className="profile">
      <span>
        {t('mypage.title', {
          nickname: user.nickname,
          days: durationDate.days,
          hours: durationDate.hours,
          minutes: durationDate.minutes,
          seconds: durationDate.seconds,
        })}
      </span>
    </div>
  )
}

export default Profile
