import YouTube from 'react-youtube'
import { MusicData } from '../../types'
import './MusicPlayer.scss'

type MusicPlayerProps = {
  music: MusicData
}

const MusicPlayer = ({ music }: MusicPlayerProps) => {
  return (
    <section className="music-player">
      <img className="music-player__cover" src={music.coverURL} />
      <YouTube
        videoId={music.videoId}
        id="youtube"
        opts={{
          height: '1',
          width: '1',
          playerVars: {
            autoplay: 1,
          },
        }}
      />
      <div className="music-player__info">
        <p>
          {(
            music.title +
            '\u00a0-\u00a0' +
            music.artist +
            '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'
          ).repeat(5)}
        </p>
      </div>
    </section>
  )
}

export default MusicPlayer
