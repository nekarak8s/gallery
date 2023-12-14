import { PostData } from '../../types'
import Post from '../Post/Post'
import CommentList from '@/features/comment/components/CommentList'
import './PostDetail.scss'

type PostDetailProps = {
  post: PostData
}

const PostDetail = ({ post }: PostDetailProps) => {
  return (
    <article className="post-detail">
      <Post post={post} />
      <CommentList postId={post.postId} />
    </article>
  )
}

export default PostDetail
