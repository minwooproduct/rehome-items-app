//Upload page using ShadCN components

"use client";

import { useState, useEffect } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

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

import { supabaseClient } from "@/lib/initSupabase";
import { useUser } from "@clerk/nextjs";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const formSchema = z.object({
  item_name: z.string().min(2).max(50),
  item_description: z.string().max(250),
  item_price: z.number().int().positive(),
});

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const { session } = useSession();
  const token = session?.getToken();

  //1. Form definition
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_name: "",
      item_description: "",
    },
  });

  //User checks
  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }
  if (!isSignedIn || !user) {
    return <div>Please sign in or wait for user data to load.</div>;
  }

  //2. Submit handler
  async function onSubmit(values) {
    if (!files[0]) return; // Make sure there's at least one file selected
    
    const file = files[0].file; // Assuming you're dealing with the first file
    const uuid = uuidv4(); // Generate a UUID for this file upload
    const filePath = `${user.id}/${uuid}/${file.name}`; // Construct the file path
  
    try {
      // Upload the file to Supabase Storage
      const { data, error } = await supabaseClient.storage.from("images").upload(filePath, file, {
        contentType: file.type, // Optionally set the MIME type (contentType) of the file
        upsert: false // Example option: if set to true, will overwrite existing files with the same path
      });
  
      if (error) throw error;
  
      // Success - handle the response, e.g., storing the file URL in your database
      console.log('File uploaded successfully:', data);
    } catch (error) {
      console.error('Upload error:', error.message);
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              maxfiFiles={1}
              name="files"
              labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
          </div>
          <Button type="submit">Upload</Button>
        </form>
      </Form>
    </div>
  );
}
