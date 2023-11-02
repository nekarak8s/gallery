import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type LoginState = {
  expDate: string
  isLogin: () => boolean
  setExpDate: (expDate: string) => void
  resetExpDate: () => void
}

const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      expDate: '',
      isLogin: () => {
        const expDate = get().expDate
        if (!expDate) return false
        if (new Date(expDate) < new Date()) return false
        return true
      },
      setExpDate: (expDate) => set({ expDate }),
      resetExpDate: () => set({ expDate: '' }),
    }),
    {
      name: 'expiration-date', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ expDate: state.expDate }),
    }
  )
)

export { useLoginStore }
