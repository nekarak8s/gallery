import { useTranslation } from 'react-i18next'
import Button3D from '@/atoms/ui/Button3D'
import Loading from '@/atoms/ui/Loading'
import { usePlaceListQuery } from '@/features/gallery/services'
import './GallerySelection.scss'

type GallerySelectionProps = {
  onSelect: (galleryId: number) => void
}

function GallerySelection({ onSelect }: GallerySelectionProps) {
  const { t } = useTranslation()
  const { data: placeList, isLoading, isError } = usePlaceListQuery()

  if (isError) return

  if (isLoading) return <Loading />

  return (
    <div className="gallery-selection">
      <h2 className="gallery-selection__title">{t('gallery.chooseType')}</h2>
      <ul className="gallery-selection__list">
        {placeList?.map((place) => (
          <li key={place.placeId}>
            <Button3D onClick={() => onSelect(place.placeId)} ariaLabel={`${place.name} 타입 갤러리`}>
              <div className="gallery-selection__button">
                <img src={place.threeDimensionImageUri} alt={`${place.name} 3D 이미지`} />
                <span>{place.name}</span>
              </div>
            </Button3D>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default GallerySelection
