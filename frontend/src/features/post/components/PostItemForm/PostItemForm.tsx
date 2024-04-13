import { ChangeEvent, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PostData } from '../../types'
import DragIcon from '@/assets/svgs/drag.svg'
import Checkbox from '@/atoms/form/Checkbox'
import File from '@/atoms/form/File'
import Select from '@/atoms/form/Select'
import Text from '@/atoms/form/Text'
import Textarea from '@/atoms/form/Textarea'
import Button from '@/atoms/ui/Button'
import Modal from '@/atoms/ui/Modal'
import { CURSOR_SCALE } from '@/constants'
import MusicSearch from '@/features/music/components/MusicSearch'
import { MusicData } from '@/features/music/types'
import './PostItemForm.scss'

type PostItemFormProps = {
  post: PostData
  index: number
}

const PostItemForm = ({ post, index }: PostItemFormProps) => {
  const { t } = useTranslation()

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
  const [isActive, setIsActive] = useState(post.isActive)

  const handleIsActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsActive(event.target.checked)
  }

  /**
   * Show the preview image
   */
  const [imageURL, setImageUrl] = useState<string | undefined>(post.imageURL)

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

  const [music, setMusic] = useState<MusicData | undefined>(post.music)

  return (
    <>
      <article className={`post-item-form`} ref={cardRef}>
        <div className={`post-item-form__header ${isActive || 'inactive'}`} tabIndex={0} onClick={toggleCard}>
          <input type="hidden" name={`posts[${index}].postId`} value={post.postId} />
          <input type="hidden" name={`posts[${index}].order`} value={index + 1} />
          {false && (
            <div className="post-item-form__drag" data-cursor-scale={CURSOR_SCALE}>
              <DragIcon />
            </div>
          )}
          <div className="post-item-form__order-title">
            <span className="post-item-form__toggle">&#9654;</span>
            <span>{t('updatePost.order', { order: index + 1 })}</span>
            <span>|</span>
            <h2>{title}</h2>
          </div>
          <Checkbox
            name={`posts[${index}].isActive`}
            value="true"
            falseValue="false"
            label={isActive ? t('updatePost.display') : t('updatePost.storage')}
            defaultChecked={post.isActive}
            onChange={handleIsActiveChange}
          />
        </div>
        <div className="post-item-form__card">
          <img src={imageURL} />
          <File
            name={`posts[${index}].image`}
            accept="image/png, image/jpeg"
            placeholder={t('updatePost.uploadWork')}
            uploadBtnText={t('buttons.upload')}
            resetBtnText={t('buttons.cancel')}
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
              <option value="">{t('updatePost.noMusic')}</option>
            </Select>
            <Button text={t('buttons.selectMusic')} size="sm" onClick={() => setIsMusicOpen(true)} />
          </div>
          <Text label={t('inputs.title')} name={`posts[${index}].title`} initialValue={post.title} onChange={handleChangeTitle} />
          <Textarea label={t('inputs.description')} name={`posts[${index}].content`} initialValue={post.content} height="4em" maxLen={500} />
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
