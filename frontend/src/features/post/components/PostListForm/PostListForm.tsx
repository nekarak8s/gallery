import React from 'react'
import { PostItemData } from '../../types'
import PostItemForm from '../PostItemForm'
import './PostListForm.scss'

type PostListFormProps = {
  postList: PostItemData[]
}

const PostListForm = ({ postList }: PostListFormProps) => {
  return (
    <ol className="post-list-form">
      {postList.map((post, index) => (
        <li key={`${post.postId}-${new Date().toISOString()}`}>
          <PostItemForm post={post} index={index} />
        </li>
      ))}
    </ol>
  )
}

export default PostListForm
