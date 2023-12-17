import React from 'react'
import { useGalleryQuery, usePlaceListQuery, useUpdateGallery } from '../../services'
import PlacesRadio from '../PlacesRadio'
import Form from '@/atoms/form/Form'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import './GalleryUpdateForm.scss'
import Loading from '@/atoms/ui/Loading'
import PostForm from '@/features/post/components/PostItemForm'
import { usePostListQuery, useUpdatePostList } from '@/features/post/services'

type GalleryDetailFormProps = {
  galleryId: number
}

const GalleryUpdateForm = ({ galleryId }: GalleryDetailFormProps) => {
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

  const { mutate: updateGallery } = useUpdateGallery(galleryId)
  const { mutate: updatePostList } = useUpdatePostList(galleryId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    /*eslint-disable*/
    const formData = new FormData(e.currentTarget)
    // FormData의 key 확인

    const name = formData.get('name') as string
    formData.delete('name')
    const content = formData.get('content') as string
    formData.delete('content')
    const placeId = formData.get('placeId') as string
    formData.delete('placeId')

    console.log('formData형식')
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }
    updateGallery({
      name,
      content,
      placeId: parseInt(placeId),
    })

    updatePostList(formData)
  }

  if (isGalleryError || isPlaceError || isPostError) return null

  if (isGalleryLoading || isPlaceLoading || isPostLoding) return <Loading />

  return (
    <Form className="gallery-update-form" onSubmit={handleSubmit}>
      <Text label="전시회 이름" name="name" initialValue={gallery.name} />
      <Textarea label="소개글" name="content" initialValue={gallery.content} />
      <PlacesRadio placeList={placeList} defaultChecked={gallery.place.placeId} />
      <ol>
        {postList.map((post, index) => (
          <li key={post.postId}>
            <PostForm post={post} index={index} />
          </li>
        ))}
      </ol>
      <Button type="submit" direction="center" ariaLabel="전시회 생성" text="수정하기" />
    </Form>
  )
}

export default GalleryUpdateForm
