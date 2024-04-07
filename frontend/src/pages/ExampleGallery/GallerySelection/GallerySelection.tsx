import Button3D from '@/atoms/ui/Button3D'
import './GallerySelection.scss'
import Loading from '@/atoms/ui/Loading'
import { usePlaceListQuery } from '@/features/gallery/services'

type GallerySelectionProps = {
  onSelect: (galleryId: number) => void
}

function GallerySelection({ onSelect }: GallerySelectionProps) {
  const { data: placeList, isLoading, isError } = usePlaceListQuery()

  if (isError) return

  if (isLoading) return <Loading />

  return (
    <div className="gallery-selection">
      <h2 className="gallery-selection__title">입장하실 갤러리의 타입을 선택하세요</h2>
      <ul className="gallery-selection__list">
        {placeList?.map((place) => (
          <li key={place.placeId}>
            <Button3D onClick={() => onSelect(place.placeId)} ariaLabel={`${place.name} 타입 갤러리`}>
              <div className="gallery-selection__button">
                <img src={place.threeDimensionImageUri} alt={`${place.name} 3D 이미지`} />
                {place.name}
              </div>
            </Button3D>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GallerySelection
