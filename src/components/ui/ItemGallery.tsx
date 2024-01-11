'use client'

import React from 'react'

interface ItemGalleryProps {
    isOpen: boolean;
    onClose: () => void
    // children: React.ReactNode
}

const ItemGallery: React.FC<ItemGalleryProps> = ({ isOpen, onClose }) => {
    if(!isOpen) return null

    return (
        <div className='dialog-backdrop'>            
            <button onClick={onClose}>Close</button>
            </div>
    )
}

export default ItemGallery