import { useCreateComment } from '../../services'
import { validateCommentCreateForm } from '../../validators'
import Form from '@/atoms/form/Form'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import toastManager from '@/utils/toastManager'
import './CommentForm.scss'

type CommentFormProps = {
  postId: number
  onSuccess?: () => void | undefined
  onError?: () => void | undefined
}

const CommentForm = ({ postId, onSuccess, onError }: CommentFormProps) => {
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

  return (
    <Form className="comment-form" onSubmit={handleSubmit}>
      <input type="hidden" name="postId" value={postId} />
      <Text label="감상문" name="content" initialValue="" />
      <Button type="submit" text="생성" />
    </Form>
  )
}

export default CommentForm
