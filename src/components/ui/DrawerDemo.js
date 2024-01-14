import * as React from "react";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import ChipsArray from "@/components/ui/ChipsArray";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ToggleChip from "./ToggleChip";

export default function DrawerDemo(props) {
  console.log("Within DrawerDemo filterCategories is: ", props.filterCategories);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">+ Filter</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Filter</DrawerTitle>
            <DrawerDescription>
              Choose the item categories you want to see
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            {props.filterCategories.map((category, index) => (
              <ToggleChip key={index} label={category} />
            ))}
            <DrawerTitle>Filters being applied</DrawerTitle>
            <div className="p-1 flex items-center justify-center space-x-2">
              <ChipsArray>Hello</ChipsArray>
            </div>
            <DrawerTitle>Filter bag</DrawerTitle>
            <div className="p-1 flex items-center justify-center space-x-2">
              <ChipsArray>Hello</ChipsArray>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
