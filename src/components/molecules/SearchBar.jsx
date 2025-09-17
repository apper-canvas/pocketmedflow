import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  value, 
  onChange, 
  className,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <ApperIcon name="Search" size={20} className="text-secondary-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-3 py-2.5 border border-secondary-200 rounded-lg bg-white text-secondary-900 placeholder:text-secondary-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-colors duration-200"
      />
    </div>
  );
};

export default SearchBar;