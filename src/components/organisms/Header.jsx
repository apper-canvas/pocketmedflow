import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "MedFlow" }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
              <ApperIcon name="Heart" size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-error-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={20} />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-secondary-900">Dr. Sarah Johnson</p>
              <p className="text-xs text-secondary-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;