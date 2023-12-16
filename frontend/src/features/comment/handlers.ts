import { HttpResponse, http } from 'msw'
import { commentListData } from './data'

export const commentHandlers = [
  http.get('*/post/comment/list', () => {
    return HttpResponse.json({ data: commentListData }, { status: 200 })
  }),
  http.post('*/post/comment', () => {
    return HttpResponse.json({ message: '[MSW] 댓글이 생성되었습니다' }, { status: 201 })
  }),
  http.patch('*/post/comment/:commentId', () => {
    return HttpResponse.json({ message: '[MSW] 댓글이 수정되었습니다' }, { status: 200 })
  }),
  http.patch('*/post/comment/:commentId', () => {
    return HttpResponse.json({ message: '[MSW] 댓글이 삭제되었습니다' }, { status: 203 })
  }),
]
