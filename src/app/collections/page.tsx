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
- If user has less than 3 collections, show "+" button to create collections

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
/* */

/* FUNCTIONS */
import { v4 as uuidv4 } from "uuid";
/* */

/* CONNECTIONS */
import { supabaseClient } from "@/lib/initSupabase";
import { PostgrestError } from "@supabase/supabase-js";
/* */

/* USER RELATED */
import { useUser } from "@clerk/nextjs";
/* */

/* INTERFACES */
interface CollectionsResult {
  checkCollectionsData: any[];
  checkCollectionsErrors: PostgrestError | null;
  canCreateMoreCollections: boolean;
}

export default function Collections() {
  /* HOOKS */
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const { toast } = useToast();

  /* User Check */
  const { user, isLoaded, isSignedIn } = useUser();
  useEffect(() => {
    if (isLoaded) {
      console.log("user is", user);
    }
  }, [isLoaded, user]); //Tells react to run the useEffect when isLoaded changes or when the user changes

  if (!isLoaded) {
    return <div>Loading user data...</div>;
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

  const fetchCollections = async (): Promise<CollectionsResult> => {
    //Define types
    let checkCollectionsData: any[] = [];
    let checkCollectionsErrors: PostgrestError | null = null;

    //Pull all collections under that user's name
    const response = await supabaseClient
      .from("collections")
      .select("*")
      .eq("user_id", user.id);

    //If errors return with errors
    if (response.error) {
      console.log("Fetch collections failed", response.error);
      toast({
        title: "Error",
        description: `Fetch collections failed: ${response.error}`,
        duration: 5000,
      });
      checkCollectionsErrors = response.error;
    } else {
      checkCollectionsData = response.data || [];
    }
    //Else if the user does have collections take a count. If the user has more than 3 collections - show error
    const collectionsCount = checkCollectionsData
      ? checkCollectionsData.length
      : 0;
    if (collectionsCount > 3) {
      console.log("User has more than 3 collections.");
      toast({
        title: "🤔 Oh no! Collection could not be created.",
        description:
          `You've reached your 3 collection limit. 
          Please make space and try again.`,
        duration: 5000,
      });
      return {
        checkCollectionsData,
        checkCollectionsErrors,
        canCreateMoreCollections: false,
      };
    }

    //If user is permitted to create a collection, then return the data
    return {
      checkCollectionsData,
      checkCollectionsErrors,
      canCreateMoreCollections: true,
    };
  };

  /* ---------------------------------------------------------------------------------------------------- */

  const createCollection = async () => {
    //Connect to supabase and pull in existing collections
    const { checkCollectionsData, checkCollectionsErrors, canCreateMoreCollections } = await fetchCollections();

    if(!canCreateMoreCollections){
        console.log("User has more than 3 collections and is not permitted to create anymore.")
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

    //Reset states
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
