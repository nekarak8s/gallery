import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { data: placeList, isLoading: isPlaceLoading, isError: isPlaceError } = usePlaceListQuery()

  /**
   * Create Gallery
   */
  const { mutateAsync: create, isLoading: isCreateLoading } = useCreateGallery()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const form = e.currentTarget
    const formData = new FormData(form)

    // validate data
    const result = validateGalleryForm(formData)
    if (!result.result) {
      toastManager.addToast('error', result.reason)
      return
    }

    create(result.data)
      .then(() => {
        form.reset()
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
        <Text label={t('inputs.galleryName')} name="name" initialValue="" />
        <Textarea label={t('inputs.galleryContent')} name="content" initialValue="" maxLen={150} />
        <PlacesRadio placeList={placeList} showSelected={false} />
        <Button type="submit" direction="left" ariaLabel="전시회 생성" text={t('buttons.open')} />
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
