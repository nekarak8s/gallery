import { HttpResponse, http } from 'msw'
import { userData } from './data'

export const memberHandlers = [
  http.post('*/member/login', ({ request }) => {
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
  http.post('*/member/callback', ({ request }) => {
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
  http.post('*/member/logout', () => {
    return HttpResponse.json({ message: '[NSW] 로그아웃 되었습니다' }, { status: 200 })
  }),
  http.get('*/member', () => {
    return HttpResponse.json({ data: userData }, { status: 200 })
  }),
  http.patch('*/member', () => {
    return HttpResponse.json({ message: '[NSW] 회원정보가 수정되었습니다' }, { status: 200 })
  }),
  http.delete('*/member', () => {
    return HttpResponse.json({ message: '[NSW] 회원 탈퇴되었습니다' }, { status: 200 })
  }),
]
