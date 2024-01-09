"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

import { supabaseAdmin } from "@/lib/initSupabase";
import BlurImage from "@/components/ui/BlurImage";

export async function getStaticProps() {
  const { data } = await supabaseAdmin.from('images').select('*')
  console.log('Fetched data:', data); // Debug log
  return {
    props: {
      images: data || [] // Provide an empty array as default
    },
  }
}

type Image = {
  id: number,
  href: string,
  imageSrc: string,
  name: string,
  username: string
}

export default function Gallery({images}: {images: Image[]}) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {/* Images will go here */}
        {images?.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>      
    </div>
  );
}
