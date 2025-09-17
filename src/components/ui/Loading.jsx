import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, rows = 3 }) => {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="bg-gradient-to-r from-secondary-200 via-secondary-100 to-secondary-200 h-16 rounded-lg bg-[length:200%_100%] animate-pulse"></div>
      ))}
    </div>
  );
};

export default Loading;