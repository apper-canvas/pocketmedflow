import React from "react";
import { cn } from "@/utils/cn";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: "/", icon: "LayoutDashboard", label: "Dashboard" },
    { to: "/patients", icon: "Users", label: "Patients" },
    { to: "/appointments", icon: "Calendar", label: "Appointments" },
    { to: "/beds", icon: "Bed", label: "Beds" },
    { to: "/staff", icon: "Stethoscope", label: "Staff" },
    { to: "/emergency", icon: "AlertCircle", label: "Emergency" },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-sm border-r border-secondary-200 pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-8">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              MedFlow
            </h1>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} icon={item.icon}>
                {item.label}
              </NavItem>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out lg:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-4 border-b border-secondary-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              MedFlow
            </h1>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary-100 transition-colors">
            <ApperIcon name="X" size={20} className="text-secondary-600" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon}>
              {item.label}
            </NavItem>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;