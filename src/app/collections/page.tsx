/* 

-- Background --
A user holds collections, which holds the images they would like to sell.

-- Requirements --
- A user can have many collections. 
- The limit of collections will initially be 3 per account.
- Within each collection, a user can add up to 10 photos.
- When a user creates a collection, they must name the collection. This name must be unique relative to the users other collections.
- Each collection has a unique UUID.
- Main collections page will have URL '/user_id/collections
- Each collections URL will be '/user_id/collections/uuid'

- When collections page is loaded, check all collections under logged in user_id
- Populate the grid
- If the user has more than 3 collections, remove "+" add button.
- If user has 3 or less collections, show "+" button to create collections

*/

"use client";

import { useEffect, useState } from "react";

/* COMPONENTS */
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ReloadIcon } from "@radix-ui/react-icons";
/* */

/* FUNCTIONS */
import { v4 as uuidv4 } from "uuid";
/* */

/* CONNECTIONS */
import { supabaseClient } from "@/lib/initSupabase";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
/* */

/* USER RELATED */
import { useUser } from "@clerk/nextjs";
/* */

/* INTERFACES */
interface FetchCollectionsResult {
  fetchCollectionsData: any[];
  fetchCollectionsErrors: PostgrestError | null;
  canCreateMoreCollections: boolean;
}

interface Collection {
  collection_id: String;
  collection_name: String;
  user_id: String;
  created_at: String;
}

/* ON LOAD FUNCTIONS */

async function fetchCollections(
  supabaseClient: SupabaseClient,
  userId: string
) {
  //Define types
  let fetchCollectionsData: any[] = [];
  let fetchCollectionsErrors: PostgrestError | null = null;

  //Pull all collections under that user's name
  const response = await supabaseClient
    .from("collections")
    .select("*")
    .eq("user_id", userId);

  //If errors return with errors
  if (response.error) {
    console.log("Fetch collections failed", response.error);
    fetchCollectionsErrors = response.error;
  } else {
    fetchCollectionsData = response.data || [];
    console.log("fetchCollectionsData is", fetchCollectionsData);
  }

  //If user is permitted to create a collection, then return the data
  return {
    fetchCollectionsData,
    fetchCollectionsErrors,
  };
}

/* ---------------------------------------------------------------------------------------------------- */

/* PAGE COMPONENT LAYER */

/* ---------------------------------------------------------------------------------------------------- */

export default function Collections() {
  /* HOOKS */
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const { toast } = useToast();
  const { user, isLoaded, isSignedIn } = useUser();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsUpdateCount, setCollectionsUpdateCount] = useState(0);

  useEffect(() => {
    const initFetch = async () => {
      if (isLoaded && isSignedIn && user) {
        const { fetchCollectionsData, fetchCollectionsErrors } =
          await fetchCollections(supabaseClient, user.id);
        setCollections(fetchCollectionsData);
      }
    };
    initFetch();
  }, [isLoaded, isSignedIn, user, supabaseClient, collectionsUpdateCount]); //Tells react to run the useEffect when isLoaded changes or when the user changes

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex justify-cetner items-center h-screen">
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Loading your awesome collections!
          </Button>
        </div>
      </div>
    );
  }
  if (!isSignedIn || !user) {
    return <div>Please sign in or wait for user data to load.</div>;
  }
  /* */

  /* Open and close 'create' button*/
  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  /* ---------------------------------------------------------------------------------------------------- */

  /* 
  --- 
  FUNCTIONS 
  --- 
  */

  /* ---------------------------------------------------------------------------------------------------- */

  const createCollection = async () => {
    console.log("within createCollection, collections is:", collections);

    //Check if the user is permitted to create more than 3 collections
    if (collections.length >= 3) {
      console.log(
        "User has more than 3 collections and is not permitted to create anymore."
      );
      toast({
        title: "🤔 Oh no! Collection could not be created.",
        description: `You already have 3 collections. Please make space.`,
        duration: 5000,
      });
      return;
    }

    //Locally check if the user is creating a collection with a unique name
    if (collections.some((item) => item.collection_name === collectionName)) {
      console.log(
        "Failed to create existing collections because a collection already exists with that name."
      );
      toast({
        title: "🤔 Oh no! Collection could not be created.",
        description: `You already have a collection with the name '${collectionName}'. Please try another name.`,
        duration: 5000,
      });
      return;
    }

    //If number of existing collections <3 then continue by creating a new collection in supabase
    const { data: createCollectionData, error: createCollectionErrors } =
      await supabaseClient.from("collections").insert({
        collections_id: uuidv4(),
        user_id: user.id,
        collection_name: collectionName,
      });

    //If errors exist, show error toast
    if (createCollectionErrors) {
      console.log(
        "Failed to create existing collections",
        createCollectionErrors
      );
      toast({
        title: "🤔 Oh no! Collection could not be created.",
        description: `Error was: ${createCollectionErrors.message}`,
        duration: 5000,
      });
      return;
    } else {
      console.log("Successfully created collection", createCollectionData);
      toast({
        title: "Collection created ✅",
        description: `You have a new collection called "${collectionName}"`,
        duration: 5000,
      });
    }

    //State changes
    setCollectionsUpdateCount((prevCount) => prevCount + 1);
    setCollectionName(""); //Reset the collections name
  };

  /* ---------------------------------------------------------------------------------------------------- */

  /* JSX LAYER */

  /* ---------------------------------------------------------------------------------------------------- */

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex px-4 py-4 justify-center ">Hello world</div>
      <div>
        <Popover open={isPopoverOpen}>
          <PopoverTrigger asChild onClick={togglePopover}>
            <Button variant="outline">+</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Create Collection</h4>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="width">Name</Label>
                  <Input
                    id="width"
                    defaultValue=""
                    className="col-span-2 h-8"
                    onChange={(e) => {
                      setCollectionName(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="">
              <div className="">
                <Button
                  onClick={() => {
                    createCollection();
                    togglePopover();
                  }}
                >
                  Create
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
