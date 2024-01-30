import React, { useState } from 'react'
import { useGalleryQuery, usePlaceListQuery, useUpdateGallery } from '../../services'
import { validateUpdateGalleryForm } from '../../validators'
import GalleryDeleteForm from '../GalleryDeleteForm'
import PlacesRadio from '../PlacesRadio'
import Form from '@/atoms/form/Form'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import Modal from '@/atoms/ui/Modal'
import PostListForm from '@/features/post/components/PostListForm/PostListForm'
import { usePostListQuery, useUpdatePostList } from '@/features/post/services'
import { validatePostListForm } from '@/features/post/validators'
import toastManager from '@/utils/toastManager'
import './GalleryUpdateForm.scss'

type GalleryDetailFormProps = {
  galleryId: number
  onSuccess?: () => void
  onError?: () => void
}

const GalleryUpdateForm = ({ galleryId, onSuccess, onError }: GalleryDetailFormProps) => {
  /**
   * Get data
   */
  const {
    data: gallery,
    isLoading: isGalleryLoading,
    isError: isGalleryError,
  } = useGalleryQuery(galleryId)
  const { data: placeList, isLoading: isPlaceLoading, isError: isPlaceError } = usePlaceListQuery()
  const {
    data: postList,
    isLoading: isPostLoding,
    isError: isPostError,
  } = usePostListQuery(galleryId)

  /**
   * Handle submit
   * 1. Update gallery
   * 2. Update post list
   */
  const { mutateAsync: updateGallery, isLoading: isUpdateGalleryLoading } =
    useUpdateGallery(galleryId)
  const { mutateAsync: updatePostList, isLoading: isUpdatePostLoading } =
    useUpdatePostList(galleryId)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    /*eslint-disable*/
    const form = e.currentTarget
    const formData = new FormData(form)

    // for (let key of formData.keys()) {
    //   console.log(key, ':', formData.get(key))
    // }

    // validate gallery data
    const galleryResult = validateUpdateGalleryForm(formData)
    if (!galleryResult.result) {
      toastManager.addToast('error', galleryResult.reason)
      return
    }

    // validate post data
    const postResult = await validatePostListForm(formData)
    if (!postResult.result) {
      toastManager.addToast('error', postResult.reason)
      return
    }

    updateGallery(galleryResult.data)
      .then(() => {
        updatePostList(postResult.data)
      })
      .then(() => {
        form.reset()
        onSuccess && onSuccess()
      })
      .catch(() => {
        onError && onError()
      })
  }

  /**
   * Handle delete
   */
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const onDeleteSuccess = () => {
    onSuccess && onSuccess()
    setIsDeleteOpen(false)
  }

  const onDeleteError = () => {
    onError && onError()
    setIsDeleteOpen(false)
  }

  if (isGalleryError || isPlaceError || isPostError) return null

  if (isGalleryLoading || isPlaceLoading || isPostLoding) return <Loading />

  return (
    <>
      <Form className="gallery-update-form" onSubmit={handleSubmit}>
        <Text label="전시회 이름" name="name" initialValue={gallery.name} />
        <Textarea label="소개글" name="content" initialValue={gallery.content} />
        <PlacesRadio placeList={placeList} defaultChecked={gallery.place.placeId} />
        <PostListForm postList={postList} />
        <div className="gallery-update-form__buttons">
          <Button type="submit" direction="center" ariaLabel="전시회 생성" text="수정하기" />
          <Button
            color="red"
            ariaLabel="전시회 삭제"
            text="삭제하기"
            onClick={() => setIsDeleteOpen(true)}
          />
        </div>
      </Form>
      {(isUpdateGalleryLoading || isUpdatePostLoading) && (
        <div className="gallery-update-form__loading">
          <Loading />
        </div>
      )}
      {isDeleteOpen && (
        <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
          <GalleryDeleteForm
            galleryId={galleryId}
            onSuccess={onDeleteSuccess}
            onError={onDeleteError}
          />
        </Modal>
      )}
    </>
  )
}

export default GalleryUpdateForm
