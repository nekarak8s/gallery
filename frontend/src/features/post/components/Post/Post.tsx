import { PostData } from '../../types'
import MusicPlayer from '@/features/music/components/MusicPlayer'
import './Post.scss'

type PostProps = {
  post: PostData
}

const Post = ({ post }: PostProps) => {
  return (
    <section className="post">
      <img className="post__image" src={post.imageUrl} />
      <div className="post__description">
        {post.music && <MusicPlayer music={post.music} />}
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    </section>
  )
}

export default Post
