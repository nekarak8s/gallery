import { useQueryClient } from '@tanstack/react-query'
import { useCommentListQuery } from '../../services'
import CommentForm from '../CommentForm'
import CommentItem from '../CommentItem'
import Loading from '@/atoms/ui/Loading'
import { UserData } from '@/features/member/types'
import './CommentList.scss'

type CommentListProps = {
  postId: number
}

const CommentList = ({ postId }: CommentListProps) => {
  /**
   * Get data
   */
  const queryClient = useQueryClient()
  const user = queryClient.getQueryData(['user']) as UserData | undefined
  const {
    data: commentList,
    isLoading: isCommentLoading,
    isError: isCommentError,
  } = useCommentListQuery(postId)

  if (isCommentError) return null

  if (isCommentLoading) return <Loading />

  return (
    <section className="comment-list">
      <ol className="comment-list__list">
        {commentList.map((comment) => (
          <li key={comment.commentId}>
            <CommentItem postId={postId} comment={comment} user={user} />
          </li>
        ))}
      </ol>
      <CommentForm postId={postId} />
    </section>
  )
}

export default CommentList
