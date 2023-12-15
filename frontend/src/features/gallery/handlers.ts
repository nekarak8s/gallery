import { HttpResponse, http } from 'msw'
import { galleryListData } from './data'

export const galleryHandlers = [
  // And here's a request handler with MSW
  // for the same "GET /user" request that
  // responds with a mock JSON response.
  http.get('*/gallery/list', () => {
    return HttpResponse.json({ data: galleryListData }, { status: 200 })
  }),
]
