import { useCreateGallery, usePlaceListQuery } from '../../services'
import { validateGalleryForm } from '../../validators'
import PlacesRadio from '../PlacesRadio'
import Form from '@/atoms/form/Form'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import toastManager from '@/utils/toastManager'
import './GalleryCreateForm.scss'

type GalleryFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

const GalleryCreateForm = ({ onSuccess, onError }: GalleryFormProps) => {
  const { data: placeList, isLoading: isPlaceLoading, isError: isPlaceError } = usePlaceListQuery()

  /**
   * Create Gallery
   */
  const { mutateAsync: create, isLoading: isCreateLoading } = useCreateGallery()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // validate data
    const formData = new FormData(e.currentTarget)
    const result = validateGalleryForm(formData)
    if (!result.result) {
      toastManager.addToast('error', result.reason)
      return
    }

    create(result.data)
      .then(() => {
        onSuccess && onSuccess()
      })
      .catch(() => {
        onError && onError()
      })
  }

  if (isPlaceError) return

  if (isPlaceLoading) return <Loading />

  return (
    <>
      <Form className="gallery-create-form" onSubmit={handleSubmit}>
        <Text label="전시회 이름" name="name" initialValue="" />
        <Textarea label="소개글" name="content" initialValue="" />
        <PlacesRadio placeList={placeList} />
        <Button type="submit" direction="left" ariaLabel="전시회 생성" text="전시회 개관" />
      </Form>
      {isCreateLoading && (
        <div className="gallery-create-form__loading">
          <Loading />
        </div>
      )}
    </>
  )
}

export default GalleryCreateForm
