import { commentListData } from '../../data'
import CommentItem from '../CommentItem'
import './CommentList.scss'

type CommentListProps = {
  postId: number
}

const CommentList = ({ postId }: CommentListProps) => {
  console.log(postId)
  const commentList = commentListData

  return (
    <section className="comment-list">
      <ol className="comment-list__list">
        {commentList.map((comment) => (
          <li key={comment.commentId}>
            <CommentItem comment={comment} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default CommentList
