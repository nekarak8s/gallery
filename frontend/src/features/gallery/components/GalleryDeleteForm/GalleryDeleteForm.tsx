import { useDeleteGallery } from '../../services'
import Form from '@/atoms/form/Form'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import './GalleryDeleteForm.scss'

type GalleryDeleteFormProps = {
  galleryId: number
  onSuccess?: () => void
  onError?: () => void
}

const GalleryDeleteForm = ({ galleryId, onSuccess, onError }: GalleryDeleteFormProps) => {
  const { mutateAsync: deleteGallery, isLoading } = useDeleteGallery(galleryId)

  const handleSubmit = function (e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation()
    e.preventDefault()

    deleteGallery()
      .then(() => {
        onSuccess && onSuccess()
      })
      .catch(() => {
        onError && onError()
      })
  }

  return (
    <>
      <Form className="gallery-delete-form" onSubmit={handleSubmit}>
        <p>정말 갤러리를 삭제하시겠습니까?</p>
        <Button
          color="red"
          type="submit"
          direction="left"
          ariaLabel="갤러리 수정"
          text="삭제하기"
        />
      </Form>
      {isLoading && (
        <div className="gallery-delete-form__loading">
          <Loading />
        </div>
      )}
    </>
  )
}

export default GalleryDeleteForm
