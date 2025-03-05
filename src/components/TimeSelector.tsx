
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
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
  console.log("TimeSelector rendering with props:", { time, isEndTime, startTime, minTime, maxTime });
  
  // Parse the time string into components
  const [hour, setHour] = useState<string>("12");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("pm");

  // Helper function to convert time string to minutes for comparison
  const timeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr === "--") return 0;
    
    const regex = /(\d+):(\d+)\s*(am|pm)/i;
    const match = timeStr.trim().toLowerCase().match(regex);
    
    if (!match) {
      console.warn(`Invalid time format: ${timeStr}`);
      return 0;
    }
    
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toLowerCase();
    
    // Convert to 24-hour format
    if (ampm === "pm" && hours < 12) {
      hours += 12;
    } else if (ampm === "am" && hours === 12) {
      hours = 0;
    }
    
    return (hours * 60) + minutes;
  };
  
  // Parse time string into components on mount and when props change
  useEffect(() => {
    console.log(`TimeSelector: Parsing time string "${time}"`);
    const regex = /(\d+):(\d+)\s*(am|pm)/i;
    const match = time.trim().toLowerCase().match(regex);
    
    if (match) {
      const newHour = match[1];
      const newMinute = match[2];
      const newPeriod = match[3].toLowerCase();
      
      console.log(`TimeSelector: Parsed time - ${newHour}:${newMinute} ${newPeriod}`);
      setHour(newHour);
      setMinute(newMinute);
      setPeriod(newPeriod);
    } else {
      console.warn(`TimeSelector: Could not parse time "${time}", using defaults`);
      setHour("12");
      setMinute("00");
      setPeriod("pm");
    }
  }, [time]);
  
  // Build a time string from components
  const buildTimeString = (): string => {
    const formattedMinute = minute.padStart(2, '0');
    return `${hour}:${formattedMinute} ${period}`;
  };
  
  // Check if current time is at minimum allowed time
  const isAtMinTime = (): boolean => {
    const currentMinutes = timeToMinutes(buildTimeString());
    const minMinutes = minTime ? timeToMinutes(minTime) : 0;
    const effectiveMinMinutes = isEndTime && startTime ? 
      Math.max(timeToMinutes(startTime), minMinutes) : minMinutes;
    
    const result = currentMinutes <= effectiveMinMinutes;
    console.log(`isAtMinTime: ${buildTimeString()} <= ${timeToMinutes(startTime || "")} or ${minMinutes} = ${result}`);
    return result;
  };
  
  // Check if current time is at maximum allowed time
  const isAtMaxTime = (): boolean => {
    const currentMinutes = timeToMinutes(buildTimeString());
    const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1;
    
    const result = currentMinutes >= maxMinutes;
    console.log(`isAtMaxTime: ${buildTimeString()} >= ${maxTime} (${maxMinutes} mins) = ${result}`);
    return result;
  };
  
  // Increment time by 15 minutes
  const handleIncrement = () => {
    console.log("🔼 Increment button clicked");
    
    // Convert current time to minutes
    let hours = parseInt(hour);
    let minutes = parseInt(minute);
    const currentPeriod = period;
    
    // Convert to 24-hour format
    let hours24 = hours;
    if (currentPeriod === "pm" && hours < 12) {
      hours24 += 12;
    } else if (currentPeriod === "am" && hours === 12) {
      hours24 = 0;
    }
    
    // Add 15 minutes
    let totalMinutes = (hours24 * 60) + minutes + 15;
    
    // Check if exceeding max time
    const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1;
    if (totalMinutes > maxMinutes) {
      console.log(`Cannot increment: ${totalMinutes} > ${maxMinutes}`);
      return;
    }
    
    // Convert back to 12-hour format
    const newHours24 = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    const newPeriod = newHours24 >= 12 ? "pm" : "am";
    let newHours12 = newHours24 % 12;
    if (newHours12 === 0) newHours12 = 12;
    
    console.log(`Incrementing from ${hours}:${minutes} ${currentPeriod} to ${newHours12}:${newMinutes} ${newPeriod}`);
    
    // Update state
    setHour(newHours12.toString());
    setMinute(newMinutes.toString().padStart(2, '0'));
    setPeriod(newPeriod);
    
    // Notify parent with new time string
    const newTimeString = `${newHours12}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
    console.log(`Calling onTimeChange with: "${newTimeString}"`);
    onTimeChange(newTimeString);
  };
  
  // Decrement time by 15 minutes
  const handleDecrement = () => {
    console.log("🔽 Decrement button clicked");
    
    // Convert current time to minutes
    let hours = parseInt(hour);
    let minutes = parseInt(minute);
    const currentPeriod = period;
    
    // Convert to 24-hour format
    let hours24 = hours;
    if (currentPeriod === "pm" && hours < 12) {
      hours24 += 12;
    } else if (currentPeriod === "am" && hours === 12) {
      hours24 = 0;
    }
    
    // Subtract 15 minutes
    let totalMinutes = (hours24 * 60) + minutes - 15;
    
    // Check if below min time
    const minMinutes = minTime ? timeToMinutes(minTime) : 0;
    const effectiveMinMinutes = isEndTime && startTime ? 
      Math.max(timeToMinutes(startTime), minMinutes) : minMinutes;
    
    if (totalMinutes < effectiveMinMinutes) {
      console.log(`Cannot decrement: ${totalMinutes} < ${effectiveMinMinutes}`);
      return;
    }
    
    // Convert back to 12-hour format
    const newHours24 = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    const newPeriod = newHours24 >= 12 ? "pm" : "am";
    let newHours12 = newHours24 % 12;
    if (newHours12 === 0) newHours12 = 12;
    
    console.log(`Decrementing from ${hours}:${minutes} ${currentPeriod} to ${newHours12}:${newMinutes} ${newPeriod}`);
    
    // Update state
    setHour(newHours12.toString());
    setMinute(newMinutes.toString().padStart(2, '0'));
    setPeriod(newPeriod);
    
    // Notify parent with new time string
    const newTimeString = `${newHours12}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`;
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
            console.log("🔼 Increment button clicked in UI");
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
            isAtMinTime() ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"
          )}
          onClick={() => {
            console.log("🔽 Decrement button clicked in UI");
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
