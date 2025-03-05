
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

const TimeSelector = ({ 
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

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm w-36 h-40">
      <div className="flex justify-center">
        <button 
          className={cn(
            "flex items-center justify-center py-2 w-full",
            isAtMaxTime ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={() => {
            console.log("🔼 Increment button clicked in UI");
            if (!isAtMaxTime) {
              handleIncrement();
            }
          }}
          disabled={isAtMaxTime}
          aria-label="Increase time"
          type="button"
        >
          <ChevronUp size={24} />
        </button>
      </div>
      
      <TimeDisplay
        hour={hour}
        minute={minute}
        period={period}
      />
      
      <div className="flex justify-center">
        <button 
          className={cn(
            "flex items-center justify-center py-2 w-full",
            isAtMinTime ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={() => {
            console.log("🔽 Decrement button clicked in UI");
            if (!isAtMinTime) {
              handleDecrement();
            }
          }}
          disabled={isAtMinTime}
          aria-label="Decrease time"
          type="button"
        >
          <ChevronDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default TimeSelector;
