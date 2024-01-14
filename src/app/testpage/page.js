"use client";

import React from "react";
import ChipsArray from "@/components/ui/ChipsArray";
import { Button, buttonVariants } from "@/components/ui/button";
import DrawerDemo from "@/components/ui/DrawerDemo";
import filterCategories from "@/lib/filterCategories";

export default function TestPage() {
  console.log("Within test page filterCategories is: ", filterCategories);
  
  return (
    <div>
      {/* <Button class="flex justify-center items-center h-screen">
            + Filter
        </Button> */}

      <ChipsArray />

      <DrawerDemo filterCategories={filterCategories} />
    </div>
  );
}
