import { useState } from 'react'
import { PostData } from '../../types'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Modal from '@/atoms/ui/Modal'
import MusicSearch from '@/features/music/components/MusicSearch'

import './PostItemForm.scss'

type PostFormProps = {
  post: PostData
  index: number
}

const PostForm = ({ post, index }: PostFormProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const [imageUrl, setImageUrl] = useState<string | undefined>(post.imageUrl)
  const [music, setMusic] = useState(post.music)

  // console.log(music, isOpen)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return

    const imageFile = event.target.files[0]

    const fileReader = new FileReader()
    fileReader.readAsDataURL(imageFile)

    fileReader.onload = function () {
      if (typeof fileReader.result === 'string') {
        setImageUrl(fileReader.result)
      }
    }
  }

  return (
    <>
      <div className="post-item-form">
        <input readOnly type="number" name={`posts[${index}].id`} value={post.postId} />
        <input readOnly type="number" name={`posts[${index}].order`} value={index + 1} />
        <img className="post-item-form__image" src={imageUrl} />
        <input
          type="file"
          name={`posts[${index}].image`}
          accept="image/*"
          onChange={handleChange}
        />
        <Text label="제목" name={`posts[${index}].title`} initialValue={post.title} />
        <Textarea label="설명" name={`posts[${index}].content`} initialValue={post.content} />
        {music && (
          <select name={`posts[${index}].musicId`}>
            <option className="post-form__music" value={music.musicId}>
              <img src={music.coverURL} />
              {music.title} - {music.artist}
            </option>
          </select>
        )}
        <input type="checkbox" name={`posts[${index}].isActive`} checked={true} />
        <Button text="음악 수정" onClick={() => setIsOpen(true)} />
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <MusicSearch
          onSelect={(music) => {
            setMusic(music)
            setIsOpen(false)
            console.log('modal', music)
          }}
        />
      </Modal>
    </>
  )
}

export default PostForm
