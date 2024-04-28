import { HttpResponse, http, delay } from 'msw'
import { galleryData, galleryListData, placeListData } from './data'

export const galleryHandlers = [
  http.get('*/api/gallery/list', async () => {
    await delay()
    return HttpResponse.json({ data: galleryListData }, { status: 200 })
  }),
  http.post('*/api/gallery', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 갤러리가 생성되었습니다' }, { status: 201 })
  }),
  http.get('*/api/gallery/search', async ({ request }) => {
    await delay()

    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const query = url.searchParams.get('query')

    const content =
      '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음'

    let data = [
      {
        galleryId: 1,
        title: `${query} 123`,
        nickname: '홍길동',
        content,
        createdDate: '2023-08-03T23:59:59',
      },
      {
        galleryId: 2,
        title: `전시회`,
        nickname: `${query} 자까`,
        content,
        createdDate: '2023-08-03T23:59:59',
      },
      {
        galleryId: 3,
        title: `${query} 456`,
        nickname: '고길동',
        content,
        createdDate: '2023-08-03T23:59:59',
      },
      {
        galleryId: 4,
        title: `${query} 33`,
        nickname: '어휴',
        content,
        createdDate: '2023-08-03T23:59:59',
      },
      {
        galleryId: 5,
        title: `${query} 44`,
        nickname: '진짜',
        content,
        createdDate: '2023-08-03T23:59:59',
      },
    ]

    if (type === 'title') {
      data = [
        {
          galleryId: 1,
          title: `${query} 123`,
          nickname: '몽그리',
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 2,
          title: `${query} 456`,
          nickname: '바비팍',
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 3,
          title: `${query} 789`,
          nickname: '루이보스',
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 4,
          title: `${query} 33`,
          nickname: '어휴',
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 5,
          title: `${query} 44`,
          nickname: '진짜',
          content,
          createdDate: '2023-08-03T23:59:59',
        },
      ]
    }

    if (type === 'author') {
      data = [
        {
          galleryId: 1,
          title: `기막힌 전시회`,
          nickname: `${query} 1`,
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 2,
          title: `코막힌 전시회`,
          nickname: `${query} 2`,
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 3,
          title: `트랄랄랄라`,
          nickname: `${query} 동명이인`,
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 2,
          title: `돈까스`,
          nickname: `${query} 도플갱어`,
          content,
          createdDate: '2023-08-03T23:59:59',
        },
        {
          galleryId: 3,
          title: `치즈 크륌 뷔렐레`,
          nickname: `${query} 하하`,
          content,
          createdDate: '2023-08-03T23:59:59',
        },
      ]
    }

    return HttpResponse.json(
      {
        data: data,
      },
      { status: 200 }
    )
  }),
  http.get('*/api/gallery/:galleryId', async () => {
    await delay()

    const data = galleryData
    if (Math.random() < 1 / 3) {
      data.place.placeId = 2
    }
    if (Math.random() < 1 / 3) {
      data.place.placeId = 3
    }

    return HttpResponse.json({ data: data }, { status: 200 })
  }),
  http.patch('*/api/gallery/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 갤러리가 수정되었습니다' }, { status: 200 })
  }),
  http.delete('*/api/gallery/:galleryId', async () => {
    await delay()
    return HttpResponse.json({ message: '[MSW] 갤러리가 삭제되었습니다' }, { status: 203 })
  }),
  http.get('*/api/gallery/place/list', async () => {
    await delay()
    return HttpResponse.json({ data: placeListData }, { status: 200 })
  }),
]
