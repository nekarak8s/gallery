import { HttpResponse, http } from 'msw'
import { galleryData, galleryListData, placeListData } from './data'

export const galleryHandlers = [
  http.get('*/api/gallery/list', () => {
    return HttpResponse.json({ data: galleryListData }, { status: 200 })
  }),
  http.post('*/api/gallery', () => {
    return HttpResponse.json({ message: '[MSW] 갤러리가 생성되었습니다' }, { status: 201 })
  }),
  http.get('*/api/gallery/:galleryId', () => {
    return HttpResponse.json({ data: galleryData }, { status: 200 })
  }),
  http.patch('*/api/gallery/:galleryId', () => {
    return HttpResponse.json({ message: '[MSW] 갤러리가 수정되었습니다' }, { status: 200 })
  }),
  http.get('*/api/gallery/place/list', () => {
    return HttpResponse.json({ data: placeListData }, { status: 200 })
  }),
]
