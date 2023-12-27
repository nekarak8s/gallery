import React from 'react'
import { MusicSearchData } from '../../types'
import './MusicSearchItem.scss'

type MusicSearchItemProps = {
  music: MusicSearchData
}

function MusicSearchItem({ music }: MusicSearchItemProps) {
  return (
    <div className="music-search-item">
      <img src={music.coverURL} />
      <div className="music-search-item__text">
        <p>
          {(
            music.title +
            '\u00a0-\u00a0' +
            music.artist +
            '\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0\u00a0'
          ).repeat(10)}
        </p>
      </div>
    </div>
  )
}

export default MusicSearchItem
