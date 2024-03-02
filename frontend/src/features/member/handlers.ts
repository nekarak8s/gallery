import { HttpResponse, http, delay } from 'msw'
import { userData } from './data'

export const memberHandlers = [
  http.post('*/api/member/login', async ({ request }) => {
    await delay()

    // get query parameters
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    console.log('type', type)

    // make response
    return HttpResponse.json(
      {
        data:
          (((process.env.REACT_APP_API_BASE_URL as string) +
            process.env.REACT_APP_BASE_URL) as string) + '/oauth/kakao',
      },
      { status: 200 }
    )
  }),
  http.post('*/api/member/callback', async ({ request }) => {
    await delay()

    // get parameters
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const code = url.searchParams.get('code')
    console.log('type', type)
    console.log('code', code)

    // make response
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    return HttpResponse.json(
      {
        data: {
          expirationDate: oneHourLater,
        },
      },
      { status: 200 }
    )
  }),
  http.post('*/api/member/logout', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 로그아웃 되었습니다' }, { status: 200 })
  }),
  http.get('*/api/member', async () => {
    await delay()
    return HttpResponse.json({ data: userData }, { status: 200 })
  }),
  http.patch('*/api/member', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 회원정보가 수정되었습니다' }, { status: 200 })
  }),
  http.delete('*/api/member', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 회원 탈퇴되었습니다' }, { status: 200 })
  }),
]
