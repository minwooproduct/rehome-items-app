//Upload page using ShadCN components

"use client";

/* UTILITY */
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

/* CONNECTIONS */
import { supabaseClient } from "@/lib/initSupabase";
import { useUser } from "@clerk/nextjs";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

/* COMPONENTS */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FILE_POND_BUCKET } from "@/lib/constant";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import LoadingSpinner from "./LoadingSpinner";

const formSchema = z.object({
  item_name: z.string().min(2).max(50),
  item_owner: z.string().min(2).max(50),
  item_description: z.string().max(250),
  item_price: z.number().int().positive(),
  imageSrc: z.string(),
  collection_id: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UploadForm({ closeUploadModalAndResetValues }) {
  /* HOOKS */
  const [files, setFiles] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const [isPendingLoading, setPendingLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const { session } = useSession();
  const token = session?.getToken();

  const paramsObjectFromRoute = useParams<{
    individualCollectionsPage: string;
  }>();

  useEffect(() => {
    if (user) {
      form.setValue("item_owner", user.id);
    }
  }, [user]);

  //1. Form definition
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: "",
      item_owner: "",
      item_description: "",
      item_price: 0,
      imageSrc: "",
      collection_id: paramsObjectFromRoute.individualCollectionsPage,
    },
  });

  const { reset, handleSubmit, control, setValue } = form;

  //User checks
  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }
  if (!isSignedIn || !user) {
    return <div>Please sign in or wait for user data to load.</div>;
  }

  //2. Submit handler
  async function onSubmit(values: FormValues) {
    setPendingLoading(true);

    // Make sure there's at least one file selected
    if (!files[0]) {
      console.log("No files were uploaded");
      toast({
        title: "🤔 Hmm... no files detected.",
        description: `Are you sure you uploaded an image?`,
        duration: 5000,
      });
      return;
    }

    const file = files[0].file; // Assuming you're dealing with the first file
    const uuid = uuidv4(); // Generate a UUID for this file upload
    const filePath = `${user.id}/${uuid}/${file.name}`; // Construct the file path

    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabaseClient.storage
        .from("images")
        .upload(filePath, file, {
          contentType: file.type, // Optionally set the MIME type (contentType) of the file
          upsert: false, // Example option: if set to true, will overwrite existing files with the same path
        });

      if (error) throw error;

      // Success - handle the response, e.g., storing the file URL in your database
      console.log("File uploaded successfully:", data);

      const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${filePath}`;

      form.setValue("imageSrc", imageUrl);
      const { error: insertImageError } = await supabaseClient
        .from("images")
        .insert({
          item_name: values.item_name,
          item_owner: user.id,
          item_description: values.item_description,
          item_price: values.item_price,
          imageSrc: imageUrl,
          collection_id: paramsObjectFromRoute.individualCollectionsPage,
        });

      if (insertImageError) {
        console.log(`Image failed to upload with error ${insertImageError}`);
        toast({
          title: "😭 There was an issue uploading your image",
          description: `Error: ${insertImageError}`,
          duration: 5000,
        });
      } else {
        console.log("Image successfully uploaded");
        toast({
          title: "🥳 Congrats! Image uploaded!",
          description: `You'll soon see the image in your collection`,
          duration: 5000,
        });
        closeUploadModalAndResetValues(); //Re-render the parent page

        
        
      }
      setPendingLoading(false);
      reset()
      setFiles([]);
    } catch (error) {
      console.error("Upload error:", error.message);
      toast({
        title: "Error uploading file",
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
      setPendingLoading(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onError)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="item_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormDescription>
                  This is the item you are putting up for sale.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="item_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter item description" {...field} />
                </FormControl>
                <FormDescription>
                  Describe what you are uploading in 250 characters or less
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="item_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      const numberValue = e.target.value
                        ? parseInt(e.target.value, 10)
                        : "";
                      field.onChange(numberValue);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  How much do you wish to sell this for?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="">
            <FilePond
              files={files}
              onupdatefiles={setFiles}
              acceptedFileTypes={["image/*"]}
              allowMultiple={false}
              maxFiles={1}
              name="files"
              labelIdle='Drag and drop images or <span class="filepond--label-action">Browse</span>'
            />
          </div>
          <button type="submit" disabled={isPendingLoading}>
            {isPendingLoading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </Form>
      {isPendingLoading && <LoadingSpinner />}
    </div>
  );
}

const onError = (errors) => {
  console.error("Form errors:", errors);
};
