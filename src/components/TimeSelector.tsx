
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { parseTimeString, buildTimeString } from "@/utils/timeUtils";

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
  console.log("TimeSelector rendering with:", { time, isEndTime, startTime, minTime, maxTime });
  
  // Parse the time string into components
  const [timeComponents, setTimeComponents] = useState(() => parseTimeString(time));
  
  // Update local state when the time prop changes
  useEffect(() => {
    console.log(`TimeSelector: time prop changed to "${time}"`);
    setTimeComponents(parseTimeString(time));
  }, [time]);
  
  // Helper function to convert time to minutes for comparison
  const timeToMinutes = (timeStr: string) => {
    const { hour, minute, period } = parseTimeString(timeStr);
    const hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    // Convert to 24-hour format
    let hours24 = hourNum;
    if (period === "pm" && hourNum < 12) {
      hours24 += 12;
    } else if (period === "am" && hourNum === 12) {
      hours24 = 0;
    }
    
    return hours24 * 60 + minuteNum;
  };
  
  // Helper to check if we're at the min time
  const isAtMinTime = () => {
    const currentMinutes = timeToMinutes(time);
    const minMinutes = minTime ? timeToMinutes(minTime) : 0;
    const effectiveMinMinutes = isEndTime && startTime ? 
      Math.max(timeToMinutes(startTime), minMinutes) : minMinutes;
    
    console.log(`isAtMinTime check: ${currentMinutes} <= ${effectiveMinMinutes} = ${currentMinutes <= effectiveMinMinutes}`);
    return currentMinutes <= effectiveMinMinutes;
  };
  
  // Helper to check if we're at the max time
  const isAtMaxTime = () => {
    const currentMinutes = timeToMinutes(time);
    const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1;
    
    console.log(`isAtMaxTime check: ${currentMinutes} >= ${maxMinutes} = ${currentMinutes >= maxMinutes}`);
    return currentMinutes >= maxMinutes;
  };
  
  // Increment time by 15 minutes
  const handleIncrement = () => {
    console.log("Increment button clicked");
    
    // Get current time components
    const { hour, minute, period } = timeComponents;
    
    // Convert to 24-hour format for calculation
    let hourNum = parseInt(hour);
    let minuteNum = parseInt(minute);
    
    let hours24 = hourNum;
    if (period === "pm" && hourNum < 12) {
      hours24 += 12;
    } else if (period === "am" && hourNum === 12) {
      hours24 = 0;
    }
    
    // Calculate new time (add 15 minutes)
    let totalMinutes = hours24 * 60 + minuteNum + 15;
    
    // Apply max constraint if needed
    if (maxTime) {
      const maxMinutes = timeToMinutes(maxTime);
      if (totalMinutes > maxMinutes) {
        console.log(`Cannot increment: ${totalMinutes} > ${maxMinutes}`);
        return;
      }
    }
    
    // Convert back to 12-hour format
    hours24 = Math.floor(totalMinutes / 60) % 24;
    minuteNum = totalMinutes % 60;
    
    // Determine new period
    const newPeriod = hours24 >= 12 ? "pm" : "am";
    
    // Convert hours to 12-hour format
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;
    
    // Update state and notify parent
    const newHour = hours12.toString();
    const newMinute = minuteNum.toString().padStart(2, '0');
    
    console.log(`Incrementing to: ${newHour}:${newMinute} ${newPeriod}`);
    
    const newTimeComponents = {
      hour: newHour,
      minute: newMinute,
      period: newPeriod
    };
    
    setTimeComponents(newTimeComponents);
    
    // Notify parent component
    const newTimeString = buildTimeString(newHour, newMinute, newPeriod);
    console.log(`Calling onTimeChange with: "${newTimeString}"`);
    onTimeChange(newTimeString);
  };
  
  // Decrement time by 15 minutes
  const handleDecrement = () => {
    console.log("Decrement button clicked");
    
    // Get current time components
    const { hour, minute, period } = timeComponents;
    
    // Convert to 24-hour format for calculation
    let hourNum = parseInt(hour);
    let minuteNum = parseInt(minute);
    
    let hours24 = hourNum;
    if (period === "pm" && hourNum < 12) {
      hours24 += 12;
    } else if (period === "am" && hourNum === 12) {
      hours24 = 0;
    }
    
    // Calculate new time (subtract 15 minutes)
    let totalMinutes = hours24 * 60 + minuteNum - 15;
    
    // Apply min constraint if needed
    const minMinutes = minTime ? timeToMinutes(minTime) : 0;
    const effectiveMinMinutes = isEndTime && startTime ? 
      Math.max(timeToMinutes(startTime), minMinutes) : minMinutes;
    
    if (totalMinutes < effectiveMinMinutes) {
      console.log(`Cannot decrement: ${totalMinutes} < ${effectiveMinMinutes}`);
      return;
    }
    
    // Convert back to 12-hour format
    hours24 = Math.floor(totalMinutes / 60) % 24;
    minuteNum = totalMinutes % 60;
    
    // Determine new period
    const newPeriod = hours24 >= 12 ? "pm" : "am";
    
    // Convert hours to 12-hour format
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;
    
    // Update state and notify parent
    const newHour = hours12.toString();
    const newMinute = minuteNum.toString().padStart(2, '0');
    
    console.log(`Decrementing to: ${newHour}:${newMinute} ${newPeriod}`);
    
    const newTimeComponents = {
      hour: newHour,
      minute: newMinute,
      period: newPeriod
    };
    
    setTimeComponents(newTimeComponents);
    
    // Notify parent component
    const newTimeString = buildTimeString(newHour, newMinute, newPeriod);
    console.log(`Calling onTimeChange with: "${newTimeString}"`);
    onTimeChange(newTimeString);
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm w-36 h-40">
      <div className="flex justify-center">
        <button 
          className={cn(
            "flex items-center justify-center py-2 w-full",
            isAtMaxTime() ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={() => {
            console.log("Increment button clicked in UI");
            if (!isAtMaxTime()) {
              handleIncrement();
            }
          }}
          disabled={isAtMaxTime()}
          aria-label="Increase time"
          type="button"
        >
          <ChevronUp size={24} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-4xl font-medium flex items-baseline">
          <span>{timeComponents.hour}</span>
          <span className="mx-1">:</span>
          <span>{timeComponents.minute}</span>
        </div>
        <div className="text-gray-500 mt-1">{timeComponents.period}</div>
      </div>
      
      <div className="flex justify-center">
        <button 
          className={cn(
            "flex items-center justify-center py-2 w-full",
            isAtMinTime() ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={() => {
            console.log("Decrement button clicked in UI");
            if (!isAtMinTime()) {
              handleDecrement();
            }
          }}
          disabled={isAtMinTime()}
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
