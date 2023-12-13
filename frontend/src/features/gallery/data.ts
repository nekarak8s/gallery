import { GalleryData, GalleryItemData, PlaceData } from './types'
import twoDimImage from '@/assets/images/gallery/2d.png'
import threeDimImage from '@/assets/images/gallery/3d.png'

export const galleryItemData: GalleryData = {
  galleryId: 1,
  name: '갤러리1',
  content:
    '대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.',
  createdDate: '2023-08-03 23:59:59',
  modifiedDate: '2023-08-04 00:59:59',
  place: {
    placeId: 1,
    name: 'Gallery A',
    maximumFrameNumber: 10,
    threeDimensionImageUrl: threeDimImage,
    twoDimensionImageUrl: twoDimImage,
  },
}

export const galleryListData: GalleryItemData[] = [
  {
    galleryId: 1,
    name: '갤러리1',
    content:
      '대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.',
    createdDate: '2023-08-03 23:59:59',
    modifiedDate: '2023-08-04 00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUrl: threeDimImage,
      twoDimensionImageUrl: twoDimImage,
    },
  },
  {
    galleryId: 2,
    name: '갤러리2',
    content:
      '대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.',
    createdDate: '2023-08-03 23:59:59',
    modifiedDate: '2023-08-04 00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUrl: threeDimImage,
      twoDimensionImageUrl: twoDimImage,
    },
  },
  {
    galleryId: 3,
    name: '갤러리3',
    content:
      '대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.',
    createdDate: '2023-08-03 23:59:59',
    modifiedDate: '2023-08-04 00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUrl: threeDimImage,
      twoDimensionImageUrl: twoDimImage,
    },
  },
  {
    galleryId: 4,
    name: '갤러리4',
    content:
      '대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.',
    createdDate: '2023-08-03 23:59:59',
    modifiedDate: '2023-08-04 00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUrl: threeDimImage,
      twoDimensionImageUrl: twoDimImage,
    },
  },
  {
    galleryId: 5,
    name: '갤러리5',
    content:
      '대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다. 대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.  대충 엄청나게 긴 내용의 갤럴리 설명입니다.',
    createdDate: '2023-08-03 23:59:59',
    modifiedDate: '2023-08-04 00:59:59',
    place: {
      placeId: 1,
      name: 'Gallery A',
      maximumFrameNumber: 10,
      threeDimensionImageUrl: threeDimImage,
      twoDimensionImageUrl: twoDimImage,
    },
  },
]

export const placeItemData: PlaceData = {
  placeId: 1,
  name: '공간1',
  maximumFrameNumber: 10,
  twoDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
  threeDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
}

export const placeListData: PlaceData[] = [
  {
    placeId: 1,
    name: '공간1',
    maximumFrameNumber: 10,
    twoDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
    threeDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
  },
  {
    placeId: 2,
    name: '공간2',
    maximumFrameNumber: 10,
    twoDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
    threeDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
  },
  {
    placeId: 3,
    name: '공간3',
    maximumFrameNumber: 10,
    twoDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
    threeDimensionImageUrl: 'https://source.unsplash.com/random/300×300',
  },
]
