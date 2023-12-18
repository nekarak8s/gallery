import { useEffect, useState } from 'react'
import { useCreateMusic, useMusicListQuery } from '../../services'
import { MusicData } from '../../types'
import Form from '@/atoms/form/Form'
import Radio from '@/atoms/form/Radio'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import useDebounce from '@/hooks/useDebounce'

import './MusicSearch.scss'

type MusicSearchProps = {
  onSelect: (music: MusicData) => void
}

const MusicSearch = ({ onSelect }: MusicSearchProps) => {
  const [query, setQuery] = useState('')
  const { data, isLoading, isError, refetch } = useMusicListQuery(query)

  const debouncedValue = useDebounce(query, 300)

  useEffect(() => {
    debouncedValue && refetch()
  }, [debouncedValue])

  const {
    mutateAsync: createMusic,
    isLoading: isCreateLoading,
    isSuccess: isCreateSuccess,
    isError: isCreateError,
  } = useCreateMusic()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    // validate data
    const formData = new FormData(e.currentTarget)

    const musicIndex = Number(formData.get('musicIndex'))

    if (!data) return

    console.log('sent')

    createMusic(data[musicIndex]).then((res) => {
      onSelect(res.data)
      console.log('res-music', res)
    })
  }

  return (
    <div className="music-search">
      <Text
        label="음악 검색"
        name="music"
        initialValue=""
        onChange={(e) => setQuery(e.target.value)}
      />
      <Form className="music-search__form" onSubmit={handleSubmit}>
        <ul className="music-search__list">
          {data &&
            data.map((music, index) => (
              <li key={`${music.artist}-${music.title}-${music.releasedDate}`}>
                <Radio id={`music-search-${index}`} name="musicIndex" value={index}>
                  <div className="music-search__item">
                    <img src={music.coverURL} />
                    <p>
                      {music.title} - {music.artist}
                    </p>
                  </div>
                </Radio>
              </li>
            ))}
        </ul>
        <Button type="submit" text="음악 선택" ariaLabel="음악 선택" />
      </Form>
    </div>
  )
}

export default MusicSearch
