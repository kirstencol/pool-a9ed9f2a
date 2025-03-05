
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
    incrementHour,
    decrementHour,
    incrementMinute,
    decrementMinute,
    isMinHour,
    isMaxHour,
    isMinMinute,
    isMaxMinute
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
      <div className="flex justify-between">
        <div className="w-1/2">
          <button 
            className={cn(
              "flex items-center justify-center py-2 w-full",
              isMaxHour ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
            )}
            onClick={incrementHour}
            disabled={isMaxHour}
            aria-label="Increase hour"
          >
            <ChevronUp size={24} />
          </button>
        </div>
        <div className="w-1/2">
          <button 
            className={cn(
              "flex items-center justify-center py-2 w-full",
              isMaxMinute ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
            )}
            onClick={incrementMinute}
            disabled={isMaxMinute}
            aria-label="Increase minute"
          >
            <ChevronUp size={24} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-4xl font-medium flex items-baseline">
          <span>{hour}</span>
          <span className="mx-1">:</span>
          <span>{minute}</span>
        </div>
        <div className="text-gray-500 mt-1">{period}</div>
      </div>
      
      <div className="flex justify-between">
        <div className="w-1/2">
          <button 
            className={cn(
              "flex items-center justify-center py-2 w-full",
              isMinHour ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
            )}
            onClick={decrementHour}
            disabled={isMinHour}
            aria-label="Decrease hour"
          >
            <ChevronDown size={24} />
          </button>
        </div>
        <div className="w-1/2">
          <button 
            className={cn(
              "flex items-center justify-center py-2 w-full",
              isMinMinute ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
            )}
            onClick={decrementMinute}
            disabled={isMinMinute}
            aria-label="Decrease minute"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(TimeSelector);
