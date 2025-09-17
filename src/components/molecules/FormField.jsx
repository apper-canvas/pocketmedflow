import React from "react";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;