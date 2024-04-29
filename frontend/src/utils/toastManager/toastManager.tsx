import { Root, createRoot } from 'react-dom/client'
import { v4 as uuidv4 } from 'uuid'
import Toast from '@/atoms/ui/Toast'
import { ToastProps } from '@/atoms/ui/Toast/Toast'
import './toastManager.scss'

type TToast = ToastProps & {
  id?: string
}

class ToastManager {
  private container: Root
  private toasts: TToast[] = []

  // Set toast message container
  constructor() {
    this.container = createRoot(document.getElementById('toast')!)
  }

  // Add a toast message
  addToast(type: 'error' | 'success' | 'info', message: string, duration: number = 3000) {
    const id = uuidv4()
    this.toasts.push({
      id,
      type,
      message,
      duration,
      destroy: () => this.deleteToast(id),
    })
    this.render()
  }

  // Delete a toast message
  deleteToast(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.render()
  }

  // Render toast messages
  private render(): void {
    const toastsList = this.toasts.map((toast) => <Toast key={toast.id} {...toast} />)
    this.container.render(toastsList)
  }
}

export default new ToastManager()
