import React, { useRef, useEffect, useMemo, useState } from 'react'
import './Toast.scss'
import SuccessIcon from '@/assets/svgs/sail.svg'
import ErrorIcon from '@/assets/svgs/wreck.svg'
import InfoIcon from '@/assets/svgs/lighthouse.svg'

export interface ToastProps {
  type: 'success' | 'error' | 'info'
  message: string
  destroy: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  destroy,
  duration = 3000,
}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((progress) => progress - 3000 / duration)
    }, 30)

    const timer = setTimeout(() => {
      destroy()
    }, duration)

    return () => {
      clearInterval(interval)
      clearTimeout(timer)
    }
  }, [])

  const icon = useMemo(() => {
    return {
      success: <SuccessIcon />,
      error: <ErrorIcon />,
      info: <InfoIcon />,
    }[type]
  }, [type])

  return (
    <div className={`toast ${type}`} tabIndex={0}>
      <div className="toast__message">
        {icon}
        <p aria-live="assertive">{message}</p>
      </div>
      <div
        className="toast__progress"
        style={{ transform: `translateX(${-100 + progress}%)` }}
      />
    </div>
  )
}

export default Toast
