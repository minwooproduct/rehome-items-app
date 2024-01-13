'use client'

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Carousel component
const CarouselDemo = dynamic(() => import('@/components/ui/CarouselDemo').then(mod => mod.CarouselDemo), {
    ssr: false,
});

export default function ItemDisplayClient() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return isClient ? <CarouselDemo /> : null;
}