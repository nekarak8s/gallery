import { HttpResponse, http, delay } from 'msw'
import { MusicSearchData } from './types'

export const musicHandlers = [
  http.get('*/api/post/music/list', async ({ request }) => {
    await delay()

    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    return HttpResponse.json(
      {
        data: [
          {
            title: `${q} 123`,
            artist: '홍길동',
            releasedDate: '2023-08-03T23:59:59',
            coverURL: 'https://source.unsplash.com/500x500',
          },
          {
            title: `${q} 456`,
            artist: '김이박',
            releasedDate: '2023-08-03T23:59:59',
            coverURL: 'https://source.unsplash.com/500x500',
          },
          {
            title: `${q} 789 sdaffffffffffffffffffffffffffffffffffffffffff`,
            artist: '철수영희',
            releasedDate: '2023-08-03T23:59:59',
            coverURL: 'https://source.unsplash.com/500x500',
          },
        ],
      },
      { status: 200 }
    )
  }),
  http.post('*/api/post/music', async ({ request }) => {
    await delay()
    const data = (await request.json()) as MusicSearchData

    const newMusicData = {
      musicId: 1,
      artist: data.artist,
      coverURL: data.coverURL,
      releasedDate: data.releasedDate,
      title: data.title,
      videoId: 'iEfIcJHEb70',
    }
    return HttpResponse.json({ data: newMusicData }, { status: 200 })
  }),
]
