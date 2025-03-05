
import { memo } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTimeSelector } from "@/hooks/useTimeSelector";
import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  minTime?: string;
  maxTime?: string;
}

const TimeSelector = ({ 
  time, 
  onTimeChange, 
  isEndTime = false, 
  startTime = "",
  minTime = "",
  maxTime = ""
}: TimeSelectorProps) => {
  const {
    hour,
    minute,
    period,
    incrementTime,
    decrementTime,
    isAtMinTime,
    isAtMaxTime
  } = useTimeSelector({
    time,
    onTimeChange,
    isEndTime,
    startTime,
    minTime,
    maxTime
  });

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm w-36 h-40">
      <div className="flex justify-center">
        <button 
          className={cn(
            "flex items-center justify-center py-2 w-full",
            isAtMaxTime ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={incrementTime}
          disabled={isAtMaxTime}
          aria-label="Increase time"
        >
          <ChevronUp size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-4xl font-medium flex items-baseline">
          <span>{hour}</span>
          <span className="mx-1">:</span>
          <span>{minute}</span>
        </div>
        <div className="text-gray-500 mt-1">{period}</div>
      </div>
      
      <div className="flex justify-center">
        <button 
          className={cn(
            "flex items-center justify-center py-2 w-full",
            isAtMinTime ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={decrementTime}
          disabled={isAtMinTime}
          aria-label="Decrease time"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default memo(TimeSelector);
