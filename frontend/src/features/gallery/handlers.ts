import { HttpResponse, http } from 'msw'
import { galleryData, galleryListData, placeListData } from './data'

export const galleryHandlers = [
  http.get('*/gallery/list', () => {
    return HttpResponse.json({ data: galleryListData }, { status: 200 })
  }),
  http.post('*/gallery', () => {
    return HttpResponse.json({ message: '[MSW] 갤러리가 생성되었습니다' }, { status: 201 })
  }),
  http.get('*/gallery/:galleryId', () => {
    return HttpResponse.json({ data: galleryData }, { status: 200 })
  }),
  http.patch('*/gallery/:galleryId', () => {
    return HttpResponse.json({ message: '[MSW] 갤러리가 수정되었습니다' }, { status: 200 })
  }),
  http.get('*/place/list', () => {
    return HttpResponse.json({ data: placeListData }, { status: 200 })
  }),
]
