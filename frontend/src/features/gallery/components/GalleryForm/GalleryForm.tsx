import { placeListData } from '../../data'
import { useCreateGallery } from '../../services'
import { validateGalleryForm } from '../../validators'
import Radio from '@/atoms/form/Radio'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import toastManager from '@/utils/toastManager'

import './GalleryForm.scss'

const GalleryForm = () => {
  const places = placeListData

  const { mutate: create } = useCreateGallery()

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // validate data
    const formData = new FormData(e.currentTarget)
    const result = validateGalleryForm(formData)

    if (!result.result) {
      toastManager.addToast('error', result.reason)
    } else {
      create(result.data)
    }
  }

  // const { data: places, isLoading, isError } = usePlaceListQuery()

  // if (isError) return

  // if (isLoading) return <Loading />

  return (
    <form className="gallery-form" onSubmit={handleSubmit}>
      {/* <BlobIcon /> */}

      <Text label="전시회 이름" name="name" initialValue="" />
      <Textarea label="소개글" name="description" initialValue="" />
      <div className="gallery-form__place">
        {places.map((place) => (
          <Radio
            key={place.placeId}
            id={`place-${place.placeId}`}
            name="placeId"
            label={place.name}
            value={place.placeId}
          >
            <img src={place.twoDimensionImageUrl} alt={`${place.name} 공간`} />
          </Radio>
        ))}
      </div>
      <Button
        type="submit"
        direction="left"
        ariaLabel="전시회 생성"
        text="전시회 개관"
      />
    </form>
  )
}

export default GalleryForm
