import React, { useRef, useEffect } from 'react'
import { useGalleryListQuery } from '../../services'
import GalleryCreate from '../GalleryCreate'
import GalleryItem from '../GalleryItem'
import './GalleryList.scss'
import Loading from '@/atoms/ui/Loading'

const GalleryList = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { data: galleryList, isLoading, isError } = useGalleryListQuery()
  // const galleryList = galleryListData
  // const isLoading = false
  // const isError = false

  useEffect(() => {
    if (!galleryList) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => {
          entry.target.classList.toggle('show', entry.isIntersecting)
          if (entry.isIntersecting) observer.unobserve(entry.target)
        },
        {
          rootMargin: '-150px',
        }
      )
    })

    const container = containerRef.current!
    const cards = container.querySelectorAll('.gallery-list__item')

    cards.forEach((card) => {
      observer.observe(card)
    })
  }, [galleryList])

  if (isLoading) return <Loading />

  if (isError) return

  return (
    <div className="gallery-list" ref={containerRef}>
      <GalleryCreate />
      {galleryList.map((gallery) => (
        <div className="gallery-list__item" key={gallery.galleryId}>
          <GalleryItem gallery={gallery} />
        </div>
      ))}
    </div>
  )
}

export default GalleryList
