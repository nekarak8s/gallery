import { setupWorker } from 'msw/browser'
import { galleryHandlers } from '@/features/gallery/handlers'
import { memberHandlers } from '@/features/member/handlers'
import { musicHandlers } from '@/features/music/handlers'
import { postHandlers } from '@/features/post/handlers'

export const worker = setupWorker(
  ...memberHandlers,
  ...postHandlers,
  ...musicHandlers,
  ...galleryHandlers
)
