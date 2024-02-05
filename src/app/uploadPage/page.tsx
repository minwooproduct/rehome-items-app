"use client";

import { useState } from "react";
import CurrencyInput from "react-currency-input-field";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { FILE_POND_BUCKET } from "@/lib/constant";

import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

registerPlugin(FilePondPluginImagePreview);

export default function UploadPage() {
  const [files, setFiles] = useState([]);

  const uploadFilesToSupabaseBucket = async () => {
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file.file, file.file.name);

      //Upload file to supabase bucket
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${FILE_POND_BUCKET}/${file.file.name}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        console.log("Upload successful:", await response.json());

        uploadFilesToSupabaseDatabase()

      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }

    // Clear files after upload or handle as needed
    setFiles([]);
  };

  const uploadFilesToSupabaseDatabase = async () => {
    
  }

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="w-1/2 mx-auto bg-lime-300 p-4">
        <div className="p-1">
          <Label>Item</Label>
          <Input placeholder="Enter Item Name" />
        </div>
        <div className="p-1">
          <Label>Description</Label>
          <Input placeholder="Enter Item Description" />
        </div>
        <div className="p-1">
          <Label>Price</Label>
          <Input placeholder="Enter Price" type="number" min="0" prefix="$" />
        </div>
        <div className="p-1">
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

        <div className="flex p-1 justify-end">
          <Button onClick={uploadFilesToSupabaseBucket} className="mt-1 bt">
            Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
