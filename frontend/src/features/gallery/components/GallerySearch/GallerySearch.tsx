import { useState, useEffect } from 'react'
import { useSearchGalleryQuery } from '../../services'
import GallerySearchItem from '../GallerySearchItem'
import CircleIcon from '@/assets/svgs/circle.svg'
import Select from '@/atoms/form/Select'
import Text from '@/atoms/form/Text'
import CSSTransition from '@/atoms/ui/CSSTransition'
import Loading from '@/atoms/ui/Loading'
import { CURSOR_SCALE } from '@/constants'
import useDebounce from '@/hooks/useDebounce'
import useFocusTrap from '@/hooks/useFocusTrap'
import './GallerySearch.scss'

type GallerySearchProps = {
  isShow: boolean
  onClose: () => void
}

const GallerySearch = ({ isShow, onClose }: GallerySearchProps) => {
  /**
   * Toggle Search
   */
  const focusRef = useFocusTrap(isShow, () => {
    onClose()
  })

  /**
   * Search Gallery
   */
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')
  const { data: galleryList, isFetching, refetch } = useSearchGalleryQuery(type, query)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    debouncedQuery && refetch()
  }, [debouncedQuery])

  return (
    <CSSTransition className="gallery-search" isShow={isShow} duration={500}>
      <div className="gallery-search__back">
        <CircleIcon />
      </div>
      <div className="gallery-search__search" ref={focusRef}>
        <div className="gallery-search__search-bar">
          <Text
            label="갤러리 검색"
            name="query"
            initialValue=""
            onChange={(e) => setQuery(e.target.value)}
          />
          <Select name="type" onChange={(e) => setType(e.target.value)}>
            <option selected value="all">
              전체
            </option>
            <option value="title">제목</option>
            <option value="author">작가</option>
          </Select>
        </div>
        <button
          className="gallery-search__close"
          data-cursor-scale={CURSOR_SCALE}
          onClick={onClose}
        >
          <span data-cursor-scale={CURSOR_SCALE} />
          <span data-cursor-scale={CURSOR_SCALE} />
        </button>
        <div className="gallery-search__list">
          {isFetching ? (
            <Loading />
          ) : (
            galleryList?.map((gallery) => (
              <GallerySearchItem key={gallery.galleryId} gallery={gallery} />
            ))
          )}
        </div>
      </div>
    </CSSTransition>
  )
}

export default GallerySearch
