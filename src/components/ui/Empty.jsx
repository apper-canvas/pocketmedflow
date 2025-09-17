import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  icon = "Inbox", 
  title = "No data found", 
  description = "Get started by adding your first item.", 
  actionLabel = "Add New",
  onAction,
  className 
}) => {
  return (
    <Card className={cn("text-center py-16", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-4 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-full">
          <ApperIcon name={icon} size={40} className="text-secondary-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
          <p className="text-secondary-600 mb-6 max-w-md">{description}</p>
          {onAction && (
            <Button onClick={onAction} variant="primary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {actionLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Empty;