import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavItem = ({ to, icon, children, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg text-secondary-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-700 transition-all duration-200 group",
          isActive && "bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-sm border border-primary-100",
          className
        )
      }
    >
      <ApperIcon 
        name={icon} 
        size={20} 
        className="transition-colors duration-200 group-hover:text-primary-600" 
      />
      <span className="font-medium">{children}</span>
    </NavLink>
  );
};

export default NavItem;