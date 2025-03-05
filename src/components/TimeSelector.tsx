
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
      <button 
        className={cn(
          "flex items-center justify-center py-2",
          (isMaxHour && isMaxMinute) ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
        )}
        onClick={incrementHour}
        disabled={isMaxHour && isMaxMinute}
        aria-label="Increase time"
      >
        <ChevronUp size={24} />
      </button>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-4xl font-medium">{hour}:{minute}</div>
        <div className="text-gray-500 mt-1">{period}</div>
      </div>
      
      <button 
        className={cn(
          "flex items-center justify-center py-2",
          (isMinHour && isMinMinute) ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
        )}
        onClick={decrementHour}
        disabled={isMinHour && isMinMinute}
        aria-label="Decrease time"
      >
        <ChevronDown size={24} />
      </button>
    </div>
  );
};

export default memo(TimeSelector);
