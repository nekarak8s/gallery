import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'gallery-expiration-date', // key for stoarge
  storage: localStorage,
})

const expDateState = atom<string>({
  key: 'ExpirationDate',
  default: '',
  effects_UNSTABLE: [persistAtom],
})

const isLoginState = selector({
  key: 'IsLogin',
  get: ({ get }) => {
    const expDateString = get(expDateState)

    if (!expDateString) return false

    if (new Date(expDateString) > new Date()) return true

    return false
  },
})

export { expDateState, isLoginState }
