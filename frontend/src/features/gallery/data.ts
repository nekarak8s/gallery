import { GalleryData, GalleryItemData, PlaceData } from './types'
import twoDimGalleryImage from '@/assets/images/gallery/2d-map/gallery.png'
import twoDimGreenaryImage from '@/assets/images/gallery/2d-map/greenary.png'
import twoDimKyotoImage from '@/assets/images/gallery/2d-map/kyoto.png'
import threeDimGalleryImage from '@/assets/images/gallery/3d-map/gallery.png'
import threeDimGreenaryImage from '@/assets/images/gallery/3d-map/greenary.png'
import threeDimKyotoImage from '@/assets/images/gallery/3d-map/kyoto.png'

export const galleryData: GalleryData = {
  galleryId: 1,
  name: '갤러리1',
  content:
    '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
  createdDate: '2023-08-03T23:59:59',
  modifiedDate: '2023-08-04T00:59:59',
  place: {
    placeId: 1,
    name: 'Gallery A',
    maximumFrameNumber: 10,
    threeDimensionImageUri: threeDimGalleryImage,
    twoDimensionImageUri: twoDimGalleryImage,
  },
}

export const galleryItemData: GalleryItemData = {
  galleryId: 1,
  name: '갤러리1',
  content:
    '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
  createdDate: '2023-08-03T23:59:59',
  modifiedDate: '2023-08-04T00:59:59',
  place: {
    placeId: 1,
    name: 'Gallery A',
    maximumFrameNumber: 10,
    threeDimensionImageUri: threeDimGalleryImage,
    twoDimensionImageUri: twoDimGalleryImage,
  },
}

export const galleryListData: GalleryItemData[] = [
  {
    galleryId: 1,
    name: '갤러리1',
    content:
      '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
    createdDate: '2023-08-03T23:59:59',
    modifiedDate: '2023-08-04T00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUri: threeDimGalleryImage,
      twoDimensionImageUri: twoDimGalleryImage,
    },
  },
  {
    galleryId: 2,
    name: '갤러리2',
    content:
      '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
    createdDate: '2023-08-03T23:59:59',
    modifiedDate: '2023-08-04T00:59:59',
    place: {
      placeId: 2,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUri: threeDimGalleryImage,
      twoDimensionImageUri: twoDimGalleryImage,
    },
  },
  {
    galleryId: 3,
    name: '갤러리3',
    content:
      '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
    createdDate: '2023-08-03T23:59:59',
    modifiedDate: '2023-08-04T00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUri: threeDimGalleryImage,
      twoDimensionImageUri: twoDimGalleryImage,
    },
  },
  {
    galleryId: 4,
    name: '갤러리4',
    content:
      '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
    createdDate: '2023-08-03T23:59:59',
    modifiedDate: '2023-08-04T00:59:59',
    place: {
      placeId: 2,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUri: threeDimGalleryImage,
      twoDimensionImageUri: twoDimGalleryImage,
    },
  },
  {
    galleryId: 5,
    name: '갤러리5',
    content:
      '이 갤러리는 19세기 영국에서 시작되어 지구를 3바퀴 돌아 이곳에 오게 되었습니다. 이른바 행운의 갤러리로 여겨지는 이 갤러리는 보면 기분이 좋아집니다. 그리고 왠지 느낌적인 느낌 느낌 마이 루키 마 수퍼루키루키 루키 마치마치 그 느낌적인 느낌느낌. 좀더 길게 쓰고 싶은데 더 쓸말이 없음',
    createdDate: '2023-08-03T23:59:59',
    modifiedDate: '2023-08-04T00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUri: threeDimGalleryImage,
      twoDimensionImageUri: twoDimGalleryImage,
    },
  },
]

export const placeItemData: PlaceData = {
  placeId: 1,
  name: '공간1',
  maximumFrameNumber: 10,
  twoDimensionImageUri: twoDimGalleryImage,
  threeDimensionImageUri: threeDimGalleryImage,
}

export const placeListData: PlaceData[] = [
  {
    placeId: 1,
    name: '초원',
    maximumFrameNumber: 10,
    twoDimensionImageUri: twoDimGreenaryImage,
    threeDimensionImageUri: threeDimGreenaryImage,
  },
  {
    placeId: 2,
    name: '갤러리',
    maximumFrameNumber: 10,
    twoDimensionImageUri: twoDimGalleryImage,
    threeDimensionImageUri: threeDimGalleryImage,
  },
  {
    placeId: 3,
    name: '교토',
    maximumFrameNumber: 10,
    twoDimensionImageUri: twoDimKyotoImage,
    threeDimensionImageUri: threeDimKyotoImage,
  },
]
