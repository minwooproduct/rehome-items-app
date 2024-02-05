import * as React from "react";
import CurrencyInput from "react-currency-input-field";
import { useState } from 'react'

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    const [value, setValue] = useState('');

  const handleValueChange = (value, name) => {
    setValue(value);
  };


  ({ className, type, ...props }, ref) => {
    return (
      <CurrencyInput
        id="currency-input"
        name="input-name"
        placeholder="Enter amount"
        defaultValue={0}
        decimalsLimit={2}
        onValueChange={handleValueChange}
        prefix="$"
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
