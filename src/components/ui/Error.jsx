import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ message = "Something went wrong", onRetry, className }) => {
  return (
    <Card className={cn("text-center py-12", className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-error-100 rounded-full">
          <ApperIcon name="AlertCircle" size={32} className="text-error-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Error Occurred</h3>
          <p className="text-secondary-600 mb-6">{message}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="primary">
              <ApperIcon name="RotateCcw" size={16} className="mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Error;