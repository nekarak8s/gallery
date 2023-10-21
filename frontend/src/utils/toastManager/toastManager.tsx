import React from 'react'
import { Root, createRoot } from 'react-dom/client'
import Toast from '@/atoms/ui/Toast'
import { ToastProps } from '@/atoms/ui/Toast/Toast'
import './toastManager.scss'

interface ToastOption extends ToastProps {
  id?: number
}

class ToastManager {
  private container: Root
  private toasts: ToastOption[]

  constructor() {
    this.container = createRoot(document.getElementById('toast')!)
    this.toasts = []
  }

  // 토스트를 추가하는 함수
  addToast(
    type: 'error' | 'success' | 'info',
    message: string,
    duration: number = 3000
  ) {
    const id = Date.now()
    this.toasts.push({
      id,
      type,
      message,
      duration,
      destroy: () => this.deleteToast(id),
    })
    this.render()
  }

  // 토스트를 닫는 함수
  deleteToast(id: number) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.render()
  }

  private render(): void {
    const toastsList = this.toasts.map((toast) => (
      <Toast key={toast.id} {...toast} />
    ))
    this.container.render(toastsList)
  }
}

export default new ToastManager()
