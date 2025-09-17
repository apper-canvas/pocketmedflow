import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex w-full rounded-lg border border-secondary-200 bg-white px-3 py-2.5 text-base text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
        error && "border-error-300 focus:border-error-500 focus:ring-error-500/20",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;