import { useMemo } from 'react'
import { PostData } from '../../types'
import MusicPlayer from '@/features/music/components/MusicPlayer'
import './PortfolioDetail.scss'
import './markdown.scss'

type PortfolioDetailProps = {
  post: PostData
}

const PortfolioDetail = ({ post }: PortfolioDetailProps) => {
  const [summary, detail] = useMemo(() => {
    return post.content.split('SPLIT')
  }, [post])

  const markup = { __html: '<p>some raw html</p>' }
  ;<div dangerouslySetInnerHTML={markup} />
  return (
    <article className="portfolio-detail">
      <section className="portfolio-detail__summary">
        <img src={post.imageURL} />
        <div>
          {post.music && <MusicPlayer music={post.music} />}
          <h1>{post.title}</h1>
          <div className="markdown" dangerouslySetInnerHTML={{ __html: summary }} />
        </div>
      </section>
      <section className="portfolio-detail__detail markdown" dangerouslySetInnerHTML={{ __html: detail }} />
    </article>
  )
}

export default PortfolioDetail
