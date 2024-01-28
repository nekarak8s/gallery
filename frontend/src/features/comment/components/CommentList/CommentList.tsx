import { useEffect } from 'react'
import { useCommentListQuery } from '../../services'
import CommentForm from '../CommentForm'
import CommentItem from '../CommentItem'
import Loading from '@/atoms/ui/Loading'
import { useUserQuery } from '@/features/member/services'
import { useLoginStore } from '@/stores/auth.store'
import './CommentList.scss'

type CommentListProps = {
  postId: number
}

const CommentList = ({ postId }: CommentListProps) => {
  /**
   * Get data
   */
  const {
    data: commentList,
    isLoading: isCommentLoading,
    isError: isCommentError,
  } = useCommentListQuery(postId)

  const { data: user, refetch: fetchUser } = useUserQuery({ enabled: false })
  const isLogin = useLoginStore((state) => state.isLogin())
  useEffect(() => {
    if (isLogin) fetchUser()
  }, [isLogin])

  if (isCommentError) return null

  if (isCommentLoading) return <Loading />

  return (
    <section className="comment-list">
      {commentList.length ? (
        <ol className="comment-list__list">
          {commentList.map((comment) => (
            <li key={comment.commentId}>
              <CommentItem postId={postId} comment={comment} user={user} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="comment-list__empty">댓글이 없습니다</div>
      )}
      <CommentForm postId={postId} user={user} />
    </section>
  )
}

export default CommentList
