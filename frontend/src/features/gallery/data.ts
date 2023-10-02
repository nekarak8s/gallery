import twoDimImage from '@/assets/images/gallery/2d.png'
import threeDimImage from '@/assets/images/gallery/3d.png'

export const galleryItemData: GalleryItemData = {
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
  galleryItemData,
  galleryItemData,
  galleryItemData,
  galleryItemData,
  galleryItemData,
]
