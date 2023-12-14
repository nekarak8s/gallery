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
      <MusicPlayer music={post.music} />
      <h1 className="post__title">{post.title}</h1>
      <p className="post__content">{post.content}</p>
    </section>
  )
}

export default Post
