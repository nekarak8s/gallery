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
  /**
   * Select icon according to type
   */
  const icon = useMemo(() => {
    return {
      success: <SuccessIcon />,
      error: <ErrorIcon />,
      info: <InfoIcon />,
    }[type]
  }, [type])

  /**
   * Move progress bar & Destroy the toast
   */
  const progressRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const progress = progressRef.current!

    //  Move progress bar
    progress.style.setProperty('--transition-time', `${duration}ms`)

    // Destroy after time duration
    const timer = setTimeout(() => {
      destroy()
    }, duration)

    return () => {
      timer && clearTimeout(timer)
    }
  }, [])

  return (
    <div className={`toast ${type}`} onClick={destroy}>
      <div className="toast__message">
        {icon}
        <p aria-live="assertive">{message}</p>
      </div>
      <div className="toast__progress" ref={progressRef} />
    </div>
  )
}

export default Toast
