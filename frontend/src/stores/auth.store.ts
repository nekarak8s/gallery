import { atom, selector } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
  key: 'gallery-expiration-date', // key for stoarge
  storage: localStorage,
})

const expirationDateState = atom<string>({
  key: 'ExpirationDate',
  default: '',
  effects_UNSTABLE: [persistAtom],
})

const isValidExpirationDateState = selector({
  key: 'IsExpirationDate',
  get: ({ get }) => {
    const expirationDateString = get(expirationDateState)

    if (!expirationDateString) {
      return false
    }

    const expirationDate = new Date(expirationDateString)
    const currentDate = new Date()

    if (expirationDate < currentDate) {
      return false
    } else {
      return true
    }
  },
})

export { expirationDateState, isValidExpirationDateState }
