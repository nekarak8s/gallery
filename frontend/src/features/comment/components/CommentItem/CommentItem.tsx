import { useState } from 'react'
import { useDeleteComment } from '../../services'
import { CommentData } from '../../types'
import TrashcanIcon from '@/assets/svgs/trashcan.svg'
import Button from '@/atoms/ui/Button'
import Modal from '@/atoms/ui/Modal'
import { UserData } from '@/features/member/types'
import './CommentItem.scss'

type CommentItemProps = {
  postId: number
  comment: CommentData
  user: UserData
}

const CommentItem = ({ postId, comment, user }: CommentItemProps) => {
  /**
   * Delete comment
   */
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { mutateAsync: deleteComment } = useDeleteComment(postId, comment.commentId)

  const handleDeleteClick = () => {
    deleteComment().then(() => {
      setIsDeleteOpen(false)
    })
  }

  return (
    <>
      <div className="comment-item">
        <p>
          <b>{comment.nickname}</b>&nbsp;&nbsp;{comment.content}
        </p>
        <p>{new Date(comment.createdDate).toLocaleDateString()}</p>
        {comment.nickname === user.nickname && (
          <button
            type="button"
            onClick={() => {
              setIsDeleteOpen(true)
            }}
            aria-label="댓글 삭제"
          >
            <TrashcanIcon />
          </button>
        )}
      </div>
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        <div className="comment-item__delete">
          <p>댓글을 삭제하시겠습니까?</p>
          <Button text="삭제" direction="right" onClick={handleDeleteClick} />
        </div>
      </Modal>
    </>
  )
}

export default CommentItem
