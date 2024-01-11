import React, { useState } from "react";
import Image from "next/image";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/initSupabase";
import BlurImage from '@/components/ui/BlurImage'

// export default async function Page() {
//   const { data } = await supabaseServer(cookies).from("images").select();
//   return <pre>{JSON.stringify(data, null, 2)}</pre>;
// }

// export async function getStaticProps() {
//   const { data, error } = await supabaseServer(cookies).from("images").select();

//   console.log("Fetched data:", data);
//   console.log("Error:", error);
  
//   if (error) {
//     return {
//       props: {
//         images: null,
//         error: error.message,
//       },
//     }
//   } 

//   return {
//     props: {
//       images: data,
//     },
//   }
// }

// function cn(...classes: string[]) {
//   return classes.filter(Boolean).join(' ')
// }

type Image = {
  id: number;
  href: string;
  imageSrc: string;
  name: string;
  userName: string;
  price: number;
  item_description: string;
};

export default async function Gallery() {

  const { data } = await supabaseServer(cookies).from("images").select();

  const images = data

  return (
    <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {images?.map((image) => (
          <BlurImage key={image.id} image={image} />
        ))}
      </div>
    </div>
  )
}


