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
          {music.title} - {music.artist}
        </p>
        <p>
          {music.title} - {music.artist}
        </p>
      </div>
    </div>
  )
}

export default MusicSearchItem
