import React from 'react';
import Link from 'next/link';
import { supabaseServer } from '@/lib/initSupabase';
import BlurImage from '@/components/ui/BlurImage';
import { cookies } from "next/headers";


export default async function Gallery() {
  
  const { data : images  } = await supabaseServer(cookies).from("images").select();

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images?.map((image) => (
          <Link key={image.id} href={`/${image.id}`} passHref>
            <BlurImage image={image} />
          </Link>
        ))}
      </div>
    </div>
  );
}
