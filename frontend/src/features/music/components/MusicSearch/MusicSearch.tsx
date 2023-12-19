import { useEffect, useState } from 'react'
import { useCreateMusic, useMusicListQuery } from '../../services'
import { MusicData } from '../../types'
import Form from '@/atoms/form/Form'
import Radio from '@/atoms/form/Radio'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
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

  const { mutateAsync: createMusic, isLoading: isCreateLoading } = useCreateMusic()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!data) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const musicIndex = Number(formData.get('musicIndex'))

    createMusic(data[musicIndex]).then((res) => {
      form.reset()
      onSelect(res.data)
    })
  }

  return (
    <>
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
      {isCreateLoading && (
        <div className="music-search__loading">
          <Loading />
        </div>
      )}
    </>
  )
}

export default MusicSearch
