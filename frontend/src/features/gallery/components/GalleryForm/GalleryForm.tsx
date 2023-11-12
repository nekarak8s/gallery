import { useEffect } from 'react'
import { useCreateGallery, usePlaceListQuery } from '../../services'
import { validateGalleryForm } from '../../validators'
import Form from '@/atoms/form/Form'
import Radio from '@/atoms/form/Radio'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import toastManager from '@/utils/toastManager'
import './GalleryForm.scss'

type GalleryFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

const GalleryForm = ({ onSuccess, onError }: GalleryFormProps) => {
  // const places = placeListData

  const {
    mutate: create,
    isLoading: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateGallery()

  useEffect(() => {
    if (isCreateSuccess) {
      onSuccess && onSuccess()
    }

    if (isCreateError) {
      onError && onError()
    }

    return () => {}
  }, [isCreateSuccess, isCreateError])

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

  const { data: places, isLoading, isError } = usePlaceListQuery()

  if (isError) return

  if (isLoading) return <Loading />

  return (
    <>
      <Form className="gallery-form" onSubmit={handleSubmit}>
        <Text label="전시회 이름" name="name" initialValue="" />
        <Textarea label="소개글" name="content" initialValue="" />
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
        <Button type="submit" direction="left" ariaLabel="전시회 생성" text="전시회 개관" />
      </Form>
      {isCreateLoading && (
        <div className="gallery-form__loading">
          <Loading />
        </div>
      )}
    </>
  )
}

export default GalleryForm
