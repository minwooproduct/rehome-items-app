"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/initSupabase";

export async function getImages() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  const { data } = await supabaseAdmin.from("images").select();

  return {
    props: {
      images: data,
    },
  };
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Image = {
  id: number;
  href: string;
  imageSrc: string;
  name: string;
  username: string;
  item_description: string;
  price: number;
};

export default function Gallery() {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    getImages().then((result) => {
      if (result.props && result.props.images) {
        setImages(result.props.images);
      }
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images?.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  );
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);
  const [isHovering, setHovering] = useState(false);

  return (
    <a href={image.href} className="group">
      {/* Tile containing the gallery */}
      <div
        className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8"
        onMouseOver={() => setHovering(true)}
        onMouseOut={() => setHovering(false)}
      >
        {/* Image rendering */}
        <Image
          alt=""
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          className={cn(
            "duration-700 ease-in-out group-hover:opacity-75",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoadingComplete={() => setLoading(false)}
        />

        {/* When the mouse is hovering over the image, show the description */}
        {isHovering && image.item_description && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white p-4">
            {image.item_description}
          </div>
        )}
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.username}</p>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.price}</p>
    </a>
  );
}
