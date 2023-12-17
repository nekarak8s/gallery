import { HttpResponse, http } from 'msw'
import { postListData } from './data'

export const postHandlers = [
  http.get('*/api/post/list/:galleryId', () => {
    return HttpResponse.json({ data: postListData }, { status: 200 })
  }),
  http.patch('*/api/post/list/:galleryId', () => {
    return HttpResponse.json({ message: '[MSW] 갤러리가 수정되었습니다' }, { status: 200 })
  }),
]
