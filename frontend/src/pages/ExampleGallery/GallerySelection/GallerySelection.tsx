import Button3D from '@/atoms/ui/Button3D'
import './GallerySelection.scss'

type GallerySelectionProps = {
  onSelect: (galleryId: number) => void
}

function GallerySelection({ onSelect }: GallerySelectionProps) {
  return (
    <div className="gallery-selection">
      <ul className="gallery-selection__list">
        <li>
          <Button3D onClick={() => onSelect(1)} ariaLabel="초원 타입">
            초원
          </Button3D>
        </li>
        <li>
          <Button3D onClick={() => onSelect(2)} ariaLabel="갤러리 타입">
            갤러리
          </Button3D>
        </li>
        <li>
          <Button3D onClick={() => onSelect(3)} ariaLabel="교토 타입">
            교토
          </Button3D>
        </li>
      </ul>
    </div>
  )
}

export default GallerySelection
