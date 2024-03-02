import { useCommentListQuery } from '../../services'
import CommentForm from '../CommentForm'
import CommentItem from '../CommentItem'
import Loading from '@/atoms/ui/Loading'
import './CommentList.scss'
import { useUserQuery } from '@/features/member/services'

type CommentListProps = {
  postId: number
}

const CommentList = ({ postId }: CommentListProps) => {
  /**
   * Get data
   */
  const { data: user, isLoading: isUserLoading, isError: isUserError } = useUserQuery()
  const {
    data: commentList,
    isLoading: isCommentLoading,
    isError: isCommentError,
  } = useCommentListQuery(postId)

  if (isUserError || isCommentError) return null

  if (isUserLoading || isCommentLoading) return <Loading />

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
