import { HttpResponse, http, delay } from 'msw'
import { galleryData, galleryListData, placeListData } from './data'

export const galleryHandlers = [
  http.get('*/api/gallery/list', async () => {
    await delay()
    return HttpResponse.json({ data: galleryListData }, { status: 200 })
  }),
  http.post('*/api/gallery', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 갤러리가 생성되었습니다' }, { status: 201 })
  }),
  http.get('*/api/gallery/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ data: galleryData }, { status: 200 })
  }),
  http.patch('*/api/gallery/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 갤러리가 수정되었습니다' }, { status: 200 })
  }),
  http.get('*/api/gallery/place/list', async () => {
    await delay()
    return HttpResponse.json({ data: placeListData }, { status: 200 })
  }),
]
