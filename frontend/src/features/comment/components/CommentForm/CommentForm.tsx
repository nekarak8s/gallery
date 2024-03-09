import { useState } from 'react'
import { useCreateComment } from '../../services'
import { validateCommentCreateForm } from '../../validators'
import Form from '@/atoms/form/Form'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import Modal from '@/atoms/ui/Modal'
import LoginForm from '@/features/member/components/LoginForm'
import { UserData } from '@/features/member/types'
import toastManager from '@/utils/toastManager'
import './CommentForm.scss'

type CommentFormProps = {
  postId: number
  user: UserData | undefined
  onSuccess?: () => void | undefined
  onError?: () => void | undefined
}

const CommentForm = ({ postId, user, onSuccess, onError }: CommentFormProps) => {
  /**
   * Create comment
   */
  const { mutateAsync: createComment } = useCreateComment(postId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // validate data
    const form = e.currentTarget
    const formData = new FormData(form)
    const result = validateCommentCreateForm(formData)
    if (!result.result) {
      toastManager.addToast('error', result.reason)
      return
    }

    // create the comment
    createComment(result.data)
      .then(() => {
        form.reset()
        onSuccess && onSuccess()
      })
      .catch(() => {
        onError && onError()
      })
  }

  /**
   * Login Modal
   */
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  return (
    <>
      <Form className="comment-form" onSubmit={handleSubmit}>
        <input type="hidden" name="postId" value={postId} />
        {user ? (
          <>
            <Text label="감상문" name="content" initialValue="" />
            <Button type="submit" text="생성" />
          </>
        ) : (
          <>
            <Text
              disabled={true}
              label="로그인 후 감상문을 작성하세요"
              name="content"
              initialValue=""
            />
            <Button type="button" text="로그인" onClick={() => setIsLoginOpen(true)} />
          </>
        )}
      </Form>
      {/* Login Modal */}
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm />
      </Modal>
    </>
  )
}

export default CommentForm
