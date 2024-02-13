import { HttpResponse, delay, http } from 'msw'
import { postListData } from './data'

export const postHandlers = [
  http.get('*/api/post/list/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ data: postListData }, { status: 200 })
  }),
  http.patch('*/api/post/list/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 사진 정보가 수정되었습니다' }, { status: 200 })
  }),
]
