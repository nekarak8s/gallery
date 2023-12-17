import { HttpResponse, http } from 'msw'
import { musicData } from './data'

export const musicHandlers = [
  http.get('*/api/post/music/list', ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    return HttpResponse.json(
      {
        data: [
          {
            title: `${q} 123`,
            artist: '홍길동',
            releasedDate: '2023-08-03T23:59:59',
            videoId: 'iEfIcJHEb70',
            coverURL: 'https://source.unsplash.com/500x500',
          },
          {
            title: `${q} 456`,
            artist: '김이박',
            releasedDate: '2023-08-03T23:59:59',
            videoId: 'iEfIcJHEb70',
            coverURL: 'https://source.unsplash.com/500x500',
          },
          {
            title: `${q} 789`,
            artist: '철수영희',
            releasedDate: '2023-08-03T23:59:59',
            videoId: 'iEfIcJHEb70',
            coverURL: 'https://source.unsplash.com/500x500',
          },
        ],
      },
      { status: 200 }
    )
  }),
  http.post('*/api/post/music', () => {
    return HttpResponse.json({ data: musicData }, { status: 200 })
  }),
]
