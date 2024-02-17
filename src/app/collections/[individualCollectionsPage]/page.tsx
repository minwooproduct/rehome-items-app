/* 

Requirements
- The individualCollectionPage hosts the images within each Collection.
- These images will be stored in a database with a relationship with the Collection.
- If the owner of the collection is viewing the page, they can add, edit or delete any of the images.
- If a non-owner is viewing the page, they only see the gallery of the images.

ADD BEHAVIOUR
- "+" Button that allows users to add in images.
- Each image should allow for a name, description, price, and file upload.


*/

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

/* COMPONENTS */
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UploadForm from "@/components/ui/uploadForm";

/* CONNECTIONS */
import { supabaseClient } from "@/lib/initSupabase";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
/* */

interface FetchCollectionsResult {
  fetchCollectionsData: any[];
  fetchCollectionsErrors: PostgrestError | null;
}

/* ON LOAD FUNCTIONS */
async function fetchIndividualCollection(
  supabaseClient: SupabaseClient,
  collectionSlug: string
) {
  //Define types
  let individualCollectionsData: any[] = [];
  let individualCollectionsErrors: PostgrestError | null = null;

  //Pull images within the collection
  const response = await supabaseClient
    .from("images")
    .select("*")
    .eq("collection_id", collectionSlug);

  //If errors return with errors
  if (response.error) {
    console.log("There was an error fetching the collection", response.error);
    individualCollectionsErrors = response.error;
  } else {
    individualCollectionsData = response.data || [];
    console.log("Data within this collection is", individualCollectionsData);
  }

  console.log(
    "ok so before the return, individualCollectionsData is",
    individualCollectionsData
  );
  console.log(
    "ok so before the return, individualCollectionsErrors is",
    individualCollectionsErrors
  );

  return {
    individualCollectionsData,
    individualCollectionsErrors,
  };
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/* TYPE DEFINITION */
type Image = {
  id: number;
  item_name: string;
  item_owner: string;
  item_price: number;
  imageSrc: string;
  item_description: string;
  created_at: string;
  collection_uuid: string;
};

export default function Page() {
  /* HOOKS */
  const paramsObjectFromRoute = useParams<{
    individualCollectionsPage: string;
  }>();
  const [refreshCollection, setRefreshCollection] = useState(false);
  const [collectionImages, setCollectionImages] = useState<any[]>([]);
  const [collectionErrors, setCollectionErrors] = useState<PostgrestError | null>(null);

  /* ADD IMAGES */
  const [isUploadPopoverOpen, setUploadPopoverOpen] = useState(false);
  const togglePopover = () => setUploadPopoverOpen(!isUploadPopoverOpen);

  const closeUploadModalAndResetValues = () => {
    setRefreshCollection(prev => !prev) //resets the form
    togglePopover()
  }

  console.log("paramsObject from route is", paramsObjectFromRoute);

  /* On initial mount, fetch the collection based on the URL param*/
  useEffect(() => {
    const initFetch = async () => {
      const { individualCollectionsData, individualCollectionsErrors } =
        await fetchIndividualCollection(
          supabaseClient,
          paramsObjectFromRoute.individualCollectionsPage
        );
      setCollectionImages(individualCollectionsData);
      setCollectionErrors(individualCollectionsErrors);
    };
    initFetch();
  }, [paramsObjectFromRoute.individualCollectionsPage, refreshCollection]);

  return (
    <div>
      <div className="mx-auto max-w-2xl pt-2 px-2 sm:pt-6 sm:px-4 lg:max-w-7xl lg:px-4">
        <div className="mt-2 mb-2 sm:mt-4 sm:mb-4 md:mt-6 md:mb-6 lg:mt-8 lg:mb-8 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {collectionImages?.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 right-0 mb-4 mr-4 rounded-full h-12 w-12 flex items-center justify-center  text-black  transition duration-150 ease-in-out">
        <Popover>
          <PopoverTrigger asChild>
            <Button onClick={togglePopover}>+</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" >
            <div>
              <UploadForm closeUploadModalAndResetValues={closeUploadModalAndResetValues}/>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);
  const [isHovering, setHovering] = useState(false);

  return (
    <a href={image.imageSrc} className="group">
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
      <h3 className="mt-4 text-sm text-gray-700">{image.item_name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">
        {image.item_name}
      </p>
      <p className="mt-1 text-lg font-medium text-gray-900">
        {image.item_price}
      </p>
    </a>
  );
}
