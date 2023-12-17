import { ChangeEventHandler, useMemo, useState } from 'react'
import { PostData } from '../../types'
import Checkbox from '@/atoms/form/Checkbox'
import File from '@/atoms/form/File'
import Select from '@/atoms/form/Select'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Modal from '@/atoms/ui/Modal'
import MusicSearch from '@/features/music/components/MusicSearch'
import './PostItemForm.scss'

type PostItemFormProps = {
  post: PostData
  index: number
}

const PostItemForm = ({ post, index }: PostItemFormProps) => {
  /**
   * Set the preview image
   */
  const [imageUrl, setImageUrl] = useState<string | undefined>(post.imageUrl)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files.length) return

    // Load image url
    const fileReader = new FileReader()
    const imageFile = event.target.files[0]

    fileReader.readAsDataURL(imageFile)
    fileReader.onload = function () {
      if (typeof fileReader.result === 'string') {
        setImageUrl(fileReader.result)
      }
    }
  }

  /**
   * Reset the preview image
   */
  const originalImageUrl = useMemo(() => {
    return post.imageUrl
  }, [])

  const handleFileReset = () => {
    setImageUrl(originalImageUrl)
  }

  /**
   * Music select modal
   */
  const [isMusicOpen, setIsMusicOpen] = useState(false)

  const [music, setMusic] = useState(post.music)

  /**
   * Change background color by isActive value
   */
  const [isActive, setIsActive] = useState(post.isActive)

  const handleIsActiveChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setIsActive(e.target.checked)
    console.log(e.target.checked)
  }

  return (
    <>
      <article className={`post-item-form ${!isActive && 'inactive'}`}>
        <input readOnly type="hidden" name={`posts[${index}].id`} value={post.postId} />
        <input readOnly type="hidden" name={`posts[${index}].order`} value={index + 1} />
        <div className="post-item-form__image-music">
          <img src={imageUrl} />
          <div>
            <File
              name={`posts[${index}].image`}
              accept="image/*"
              onChange={handleFileChange}
              onReset={handleFileReset}
            />
            <div className="post-item-form__music">
              <Select name={`posts[${index}].musicId`}>
                {music && (
                  <option selected className="post-form__music" value={music.musicId}>
                    {music.title} - {music.artist}
                  </option>
                )}
                <option value={undefined}>노래 없음</option>
              </Select>
              <Button text="음악 선택" size="sm" onClick={() => setIsMusicOpen(true)} />
            </div>
          </div>
        </div>
        <Text label="제목" name={`posts[${index}].title`} initialValue={post.title} />
        <Textarea
          label="설명"
          name={`posts[${index}].content`}
          initialValue={post.content}
          height="2.5em"
        />
        <Checkbox
          className="post-item-form__is-active"
          name={`posts[${index}].isActive`}
          defaultChecked={post.isActive}
          onChange={handleIsActiveChange}
        />
      </article>
      {/* Music Select Modal */}
      <Modal isOpen={isMusicOpen} onClose={() => setIsMusicOpen(false)}>
        <MusicSearch
          onSelect={(music) => {
            setMusic(music)
            setIsMusicOpen(false)
            console.log('modal', music)
          }}
        />
      </Modal>
    </>
  )
}

export default PostItemForm
