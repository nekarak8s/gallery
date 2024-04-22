import { useEffect, useState } from 'react'
import { useCreateMusic, useMusicListQuery } from '../../services'
import { MusicData } from '../../types'
import MusicSearchItem from '../MusicSearchItem'
import Form from '@/atoms/form/Form'
import Radio from '@/atoms/form/Radio'
import Text from '@/atoms/form/Text'
import Button from '@/atoms/ui/Button'
import Loading from '@/atoms/ui/Loading'
import useDebounce from '@/hooks/useDebounce'
import './MusicSearch.scss'
import { useTranslation } from 'react-i18next'

type MusicSearchProps = {
  onSelect: (music: MusicData) => void
}

const MusicSearch = ({ onSelect }: MusicSearchProps) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { data: musicList, isFetching: isMusicFetching, refetch } = useMusicListQuery(query)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    debouncedQuery && refetch()
  }, [debouncedQuery])

  const { mutateAsync: createMusic, isLoading: isCreateLoading } = useCreateMusic()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (!musicList) return

    const form = e.currentTarget
    const formData = new FormData(form)
    const musicIndex = Number(formData.get('musicIndex'))

    createMusic(musicList[musicIndex]).then((res) => {
      form.reset()
      onSelect(res.data)
    })
  }

  return (
    <>
      <div className="music-search">
        <Text label={t('inputs.searchMusic')} name="music" initialValue="" onChange={(e) => setQuery(e.target.value)} />
        <Form className="music-search__form" onSubmit={handleSubmit}>
          <ul className="music-search__list">
            {isMusicFetching ? (
              <Loading />
            ) : (
              musicList?.map((music, index) => (
                <li key={`${music.artist}-${music.title}-${music.releasedDate}`}>
                  <Radio id={`music-search-${index}`} name="musicIndex" value={index}>
                    <MusicSearchItem music={music} />
                  </Radio>
                </li>
              ))
            )}
          </ul>
          <Button type="submit" text={t('buttons.select')} ariaLabel="음악 선택" />
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
