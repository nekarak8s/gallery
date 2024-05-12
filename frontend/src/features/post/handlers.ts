import { HttpResponse, delay, http } from 'msw'
import { portfolioListData, postListData } from './data'
import { PORTFOLIO_GALLERY_ID } from '@/pages/ExampleGallery/ExampleGallery'

export const postHandlers = [
  http.get('*/api/post/list/:galleryId', async ({ request, params }) => {
    await delay()

    const { galleryId } = params
    const portfolioIds = Object.values(PORTFOLIO_GALLERY_ID)
    if (portfolioIds.includes(parseInt(galleryId as string))) {
      return HttpResponse.json({ data: portfolioListData }, { status: 200 })
    }

    return HttpResponse.json({ data: postListData }, { status: 200 })
  }),
  http.patch('*/api/post/list/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 게시물이 수정되었습니다' }, { status: 200 })
  }),
]
