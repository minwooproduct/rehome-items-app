'use client'

import Image from 'next/image'
import { useState } from 'react'
import ItemGallery from './ItemGallery'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BlurImage({ image }) {
  const [isLoading, setLoading] = useState(true)
  const [isHovering, setHovering] = useState(false)
  const [isItemGalleryOpen, setItemGalleryOpen] = useState(false)

  const openGallery = (e) => {
    e.preventDefault()
    setItemGalleryOpen(true)
  }
  const closeGallery = () => setItemGalleryOpen(false)

  return (
    <a href={image.href} className="group" onClick={openGallery}>
      <div 
        className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          onClick={openGallery}
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          onLoad={() => setLoading(false)}
        />
        {isHovering && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white p-4 duration-50 ease-in-out group-hover:opacity-75">
            {image.item_description}
          </div>
        )}
        <ItemGallery isOpen={isItemGalleryOpen} onClose={closeGallery}/>
      </div>
      <h3 className="mt-4 text-lg text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.price}</p>
    </a>
  )
}
