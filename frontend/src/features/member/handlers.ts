import { HttpResponse, http } from 'msw'
import { userData } from './data'

export const memberHandlers = [
  // And here's a request handler with MSW
  // for the same "GET /user" request that
  // responds with a mock JSON response.
  http.get('*/member', () => {
    return HttpResponse.json({ data: userData }, { status: 200 })
  }),
]
