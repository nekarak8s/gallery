import { CommentData } from '../../types'
import './CommentItem.scss'

type CommentItemProps = {
  comment: CommentData
}

const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <div className="comment-item">
      <p>{comment.nickname}</p>
      <p>{comment.content}</p>
    </div>
  )
}

export default CommentItem
