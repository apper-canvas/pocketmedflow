import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = "positive",
  gradient = false,
  className 
}) => {
  const changeColors = {
    positive: "text-success-600",
    negative: "text-error-600",
    neutral: "text-secondary-500"
  };

  return (
    <Card gradient={gradient} hover className={cn("relative overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-3xl font-bold text-secondary-900 mt-2 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
            {value}
          </p>
          {change && (
            <p className={cn("text-sm mt-2 flex items-center gap-1", changeColors[changeType])}>
              <ApperIcon 
                name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
                size={16} 
              />
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-full bg-gradient-to-br from-primary-100 to-accent-100">
            <ApperIcon name={icon} size={24} className="text-primary-600" />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;