'use client'

import Image from 'next/image'
import { useState } from 'react'
import ItemGallery from './ItemGallery'

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function BlurImage({ image }) {
  const [isLoading, setLoading] = useState(true)


  return (
    <a href={image.href} className="group">
      <div 
        className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"
      >
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          onLoad={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-lg text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.price}</p>
    </a>
  )
}
