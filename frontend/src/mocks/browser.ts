import { setupWorker } from 'msw/browser'
import { galleryHandlers } from '@/features/gallery/handlers'
import { memberHandlers } from '@/features/member/handlers'

export const worker = setupWorker(...memberHandlers, ...galleryHandlers)
