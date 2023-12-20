import { useState, useEffect } from 'react'
import { useSearchGalleryQuery } from '../../services'
import GallerySearchItem from '../GallerySearchItem'
import CircleIcon from '@/assets/svgs/circle.svg'
import SearchIcon from '@/assets/svgs/magnify.svg'
import XIcon from '@/assets/svgs/x.svg'
import Select from '@/atoms/form/Select'
import Text from '@/atoms/form/Text'
import CSSTransition from '@/atoms/ui/CSSTransition'
import { CURSOR_SCALE } from '@/constants'
import useDebounce from '@/hooks/useDebounce'
import useFocusTrap from '@/hooks/useFocusTrap'
import './GallerySearch.scss'

const GallerySearch = () => {
  /**
   * Toggle Search
   */
  const [isSearchShow, setIsSearchShow] = useState(false)

  const focusRef = useFocusTrap(isSearchShow, () => {
    setIsSearchShow(false)
  })

  /**
   * Search Gallery
   */
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')
  const { data: galleryList, refetch } = useSearchGalleryQuery(type, query)

  console.log(galleryList)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    debouncedQuery && refetch()
  }, [debouncedQuery])

  return (
    <div className="gallery-search">
      <button
        data-cursor-scale={CURSOR_SCALE}
        onClick={() => {
          setIsSearchShow(true)
        }}
      >
        <SearchIcon />
      </button>
      <CSSTransition className="gallery-search__background" isShow={isSearchShow} duration={1000}>
        <CircleIcon />
      </CSSTransition>
      {isSearchShow && (
        <div className="gallery-search__search" ref={focusRef}>
          <div className="gallery-search__searchbar">
            <Text
              label=" "
              placeholder="검색"
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
            onClick={() => {
              setIsSearchShow(false)
            }}
          >
            <XIcon />
          </button>
          <div className="gallery-search__list">
            {galleryList?.map((gallery) => (
              <GallerySearchItem key={gallery.galleryId} gallery={gallery} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GallerySearch
