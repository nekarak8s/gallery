import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { PostData } from '../../types'
import Checkbox from '@/atoms/form/Checkbox'
import File from '@/atoms/form/File'
import Select from '@/atoms/form/Select'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'
import MusicSearch from '@/features/music/components/MusicSearch'
import './PostItemForm.scss'
import { MusicData } from '@/features/music/types'

type PostItemFormProps = {
  post: PostData
  index: number
}

const PostItemForm = ({ post, index }: PostItemFormProps) => {
  /**
   * Open / Close the card
   */
  const cardRef = useRef<HTMLElement>(null)

  const toggleCard = () => {
    cardRef.current?.classList.toggle('open')
  }

  /**
   * Change Title
   */
  const [title, setTitle] = useState(post.title)

  const handleChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value)
  }

  /**
   * Toggle isActive (Show the post in the gallery)
   */
  const [isActive, setIsActive] = useState(true)

  const handleIsActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked)
  }

  /**
   * Show the preview image
   */
  const [imageURL, setImageUrl] = useState<string | undefined>(undefined)

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
   * Reset to the original image
   */
  const originalImageUrl = useMemo(() => {
    return post.imageURL
  }, [])

  const handleFileReset = () => {
    setImageUrl(originalImageUrl)
  }

  /**
   * Open music select modal
   */
  const [isMusicOpen, setIsMusicOpen] = useState(false)

  const [music, setMusic] = useState<MusicData | undefined>(undefined)

  useEffect(() => {
    setIsActive(post.isActive)
    setImageUrl(post.imageURL)
    setMusic(post.music)
  }, [])

  return (
    <>
      <article className={`post-item-form`} ref={cardRef}>
        <div
          className={`post-item-form__header ${isActive || 'inactive'}`}
          tabIndex={0}
          onClick={toggleCard}
          data-cursor-sclae={CURSOR_SCALE}
        >
          <input type="hidden" name={`posts[${index}].postId`} value={post.postId} />
          <input type="hidden" name={`posts[${index}].order`} value={index + 1} />
          <div className="post-item-form__order-title">
            <span className="post-item-form__toggle">&#9654;</span>
            <span>{index + 1}번</span>
            <span>|</span>
            <h2>{title}</h2>
          </div>
          <Checkbox
            className="post-item-form__is-active"
            name={`posts[${index}].isActive`}
            value="true"
            falseValue="false"
            label={isActive ? '전시 중' : '보관 중'}
            defaultChecked={post.isActive}
            onChange={handleIsActiveChange}
          />
        </div>
        <div className="post-item-form__card">
          <img src={imageURL} />
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
              <option value="">노래 없음</option>
            </Select>
            <Button text="음악 선택" size="sm" onClick={() => setIsMusicOpen(true)} />
          </div>
          <Text
            label="제목"
            name={`posts[${index}].title`}
            initialValue={post.title}
            onChange={handleChangeTitle}
          />
          <Textarea
            label="설명"
            name={`posts[${index}].content`}
            initialValue={post.content}
            height="3.5em"
          />
        </div>
      </article>
      {/* Music Select Modal */}
      <Modal isOpen={isMusicOpen} onClose={() => setIsMusicOpen(false)}>
        <MusicSearch
          onSelect={(music) => {
            setMusic(music)
            setIsMusicOpen(false)
          }}
        />
      </Modal>
    </>
  )
}

export default PostItemForm
