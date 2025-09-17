import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  gradient = false,
  hover = false,
  children,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-secondary-200 bg-white p-6 shadow-card transition-all duration-200",
        gradient && "bg-gradient-to-br from-white to-secondary-50",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;