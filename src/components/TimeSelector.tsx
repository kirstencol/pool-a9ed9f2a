
import React, { memo, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTimeSelectorState } from "@/hooks/useTimeSelectorState";
import TimeDisplay from "./TimeDisplay";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  minTime?: string;
  maxTime?: string;
}

const TimeSelector = memo(({ 
  time, 
  onTimeChange, 
  isEndTime = false, 
  startTime = "",
  minTime = "",
  maxTime = ""
}: TimeSelectorProps) => {
  console.log("TimeSelector rendering with props:", { time, isEndTime, startTime, minTime, maxTime });
  
  const {
    hour,
    minute,
    period,
    isAtMinTime,
    isAtMaxTime,
    handleIncrement,
    handleDecrement
  } = useTimeSelectorState({
    time,
    onTimeChange,
    isEndTime,
    startTime,
    minTime,
    maxTime
  });

  console.log("TimeSelector render state:", { hour, minute, period, isAtMinTime, isAtMaxTime });

  // Use direct function calls instead of useCallback to ensure events trigger correctly
  const handleIncrementClick = () => {
    console.log("⬆️ Increment button clicked");
    if (!isAtMaxTime) {
      handleIncrement();
    }
  };

  const handleDecrementClick = () => {
    console.log("⬇️ Decrement button clicked");
    if (!isAtMinTime) {
      handleDecrement();
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm w-36 h-40 relative">
      <button 
        className={cn(
          "flex items-center justify-center py-3 w-full rounded-t-lg z-10",
          isAtMaxTime ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        )}
        onClick={handleIncrementClick}
        disabled={isAtMaxTime}
        aria-label="Increase time"
        type="button"
      >
        <ChevronUp size={24} />
      </button>
      
      <TimeDisplay
        hour={hour}
        minute={minute}
        period={period}
      />
      
      <button 
        className={cn(
          "flex items-center justify-center py-3 w-full rounded-b-lg z-10",
          isAtMinTime ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
        )}
        onClick={handleDecrementClick}
        disabled={isAtMinTime}
        aria-label="Decrease time"
        type="button"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
});

TimeSelector.displayName = "TimeSelector";

export default TimeSelector;
