import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button";

const CoachesErrorState = ({ error, onRetry, onShowDetails }) => {
  return (
    <div className="flex justify-center py-8">
      <div className="text-center">
        <AlertCircle size={24} className="text-red-500 mx-auto mb-2" />
        <p className="text-red-500 font-medium mb-2">{error}</p>
        <div className="flex gap-2 justify-center mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="flex items-center gap-1"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </Button>
          {onShowDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowDetails}
              className="flex items-center gap-1"
            >
              <AlertCircle size={14} />
              <span>Show Details</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachesErrorState;
