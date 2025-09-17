import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  children,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-secondary-100 text-secondary-700 border border-secondary-200",
    critical: "bg-error-100 text-error-700 border border-error-200",
    urgent: "bg-warning-100 text-warning-700 border border-warning-200",
    stable: "bg-success-100 text-success-700 border border-success-200",
    discharged: "bg-secondary-100 text-secondary-700 border border-secondary-200",
    occupied: "bg-error-100 text-error-700 border border-error-200",
    available: "bg-success-100 text-success-700 border border-success-200",
    maintenance: "bg-warning-100 text-warning-700 border border-warning-200",
    reserved: "bg-accent-100 text-accent-700 border border-accent-200"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;