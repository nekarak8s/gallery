import { HttpResponse, delay, http } from 'msw'
import { commentListData } from './data'

export const commentHandlers = [
  http.get('*/api/post/comment/list/:postId', async () => {
    await delay()
    return HttpResponse.json({ data: commentListData }, { status: 200 })
  }),
  http.post('*/api/post/comment', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 댓글이 생성되었습니다' }, { status: 201 })
  }),
  http.patch('*/api/post/comment/:commentId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 댓글이 수정되었습니다' }, { status: 200 })
  }),
  http.delete('*/api/post/comment/:commentId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 댓글이 삭제되었습니다' }, { status: 203 })
  }),
]
