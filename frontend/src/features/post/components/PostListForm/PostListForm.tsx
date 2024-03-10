import { PostItemData } from '../../types'
import PostItemForm from '../PostItemForm'
import './PostListForm.scss'

type PostListFormProps = {
  postList: PostItemData[]
}

const PostListForm = ({ postList }: PostListFormProps) => {
  return (
    <div className="post-list-form">
      <ol>
        {postList.map((post, index) => (
          <li key={`${post.postId}-${new Date().toISOString()}`} data-post-id={post.postId}>
            <PostItemForm post={post} index={index} />
          </li>
        ))}
      </ol>
    </div>
  )
}

export default PostListForm
