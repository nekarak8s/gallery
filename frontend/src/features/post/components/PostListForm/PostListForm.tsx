import { useRef, useState } from 'react'
import { PostItemData } from '../../types'
import PostItemForm from '../PostItemForm'
import './PostListForm.scss'

type PostListFormProps = {
  postList: PostItemData[]
}

const PostListForm = ({ postList: pl }: PostListFormProps) => {
  const [postList, setPostList] = useState(pl)

  /**
   * Switch order list with drag and drop
   */
  const draggedPost = useRef<number | null>(null)
  const draggedOverPost = useRef<number | null>(null)

  // Set the init position
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.currentTarget.classList.add('dragging')
    draggedPost.current = index
  }

  // Set the target positions
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault()
    draggedOverPost.current = index
  }

  // Switch the elements
  const handleDragEnd: React.DragEventHandler<HTMLLIElement> = (e) => {
    e.currentTarget.classList.remove('dragging')

    if (draggedPost.current === null || draggedOverPost.current === null) return

    const postListClone = [...postList]
    postListClone[draggedPost.current] = postList[draggedOverPost.current]
    postListClone[draggedOverPost.current] = postList[draggedPost.current]

    setPostList(postListClone)

    draggedPost.current = null
    draggedOverPost.current = null
  }

  return (
    <ol className="post-list-form">
      {postList.map((post, index) => (
        <li
          key={`${post.postId}-${new Date().toISOString()}`}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragEnd={handleDragEnd}
        >
          <PostItemForm post={post} index={index} />
        </li>
      ))}
    </ol>
  )
}

export default PostListForm
