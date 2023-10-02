import React, { useRef, useEffect } from 'react'
import GalleryCreate from '../GalleryCreate'
import { galleryListData } from '../../data'
import GalleryItem from '../GalleryItem'
import './GalleryList.scss'

const GalleryList = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  const galleryList = galleryListData

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => {
          entry.target.classList.toggle('show', entry.isIntersecting)
          if (entry.isIntersecting) observer.unobserve(entry.target)
        },
        {
          rootMargin: '-50px',
        }
      )
    })

    const container = containerRef.current!
    const cards = container.querySelectorAll('.gallery-list__item')

    cards.forEach((card) => {
      observer.observe(card)
    })
  }, [])

  return (
    <div className="gallery-list" ref={containerRef}>
      <GalleryCreate />
      {galleryList.map((gallery) => (
        <div className="gallery-list__item">
          <GalleryItem gallery={gallery} />
        </div>
      ))}
    </div>
  )
}

export default GalleryList
