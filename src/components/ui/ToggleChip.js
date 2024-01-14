import * as React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useState } from "react";

export default function ToggleChip(props) {
  const [variant, setVariant] = useState("default");

  const handleClick = () => {
    setVariant(variant === "default" ? "outlined" : "default");
  };

  console.log("Within ToggleChip categoryTitle is: ", props.label);

  return (

      <Chip sx={{ m: '.2rem' }} label={props.label} variant={variant} onClick={handleClick}  />

  );
}