import { useRef, useEffect } from 'react'
import InfoIcon from '@/assets/svgs/lighthouse.svg'
import SuccessIcon from '@/assets/svgs/sail.svg'
import ErrorIcon from '@/assets/svgs/wreck.svg'

import './Toast.scss'

export type ToastProps = {
  type: 'success' | 'error' | 'info'
  message: string
  destroy: () => void
  duration?: number
}

const ICONS = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  info: <InfoIcon />,
}

const Toast = ({ type, message, destroy, duration = 3000 }: ToastProps) => {
  /**
   * Select icon according to type
   */
  const icon = ICONS[type]

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
