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

export default function Page() {
  /* HOOKS */
  const paramsObjectFromRoute = useParams<{
    individualCollectionsPage: string;
  }>();
  const [collectionData, setCollectionData] = useState<any[]>([]);
  const [collectionErrors, setCollectionErrors] =
    useState<PostgrestError | null>(null);

  console.log("paramsObject from route is", paramsObjectFromRoute);

  useEffect(() => {
    const initFetch = async () => {
      const { individualCollectionsData, individualCollectionsErrors } =
        await fetchIndividualCollection(
          supabaseClient,
          paramsObjectFromRoute.individualCollectionsPage
        );
      setCollectionData(individualCollectionsData);
      setCollectionErrors(individualCollectionsErrors);
    };
    initFetch();
  }, [paramsObjectFromRoute.individualCollectionsPage]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex justify-center items-center h-screen">
        {collectionData.map((item) => {
          return <Button key={item}>{item.item_name}</Button>;
        })}
      </div>
    </div>
  );
}
