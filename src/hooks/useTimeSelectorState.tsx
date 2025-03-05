
import { useState, useEffect } from "react";
import { 
  parseTimeString, 
  buildTimeString, 
  incrementTime, 
  decrementTime, 
  isAtMinTime, 
  isAtMaxTime 
} from "@/utils/timeCalculations";

interface UseTimeSelectorStateProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  minTime?: string;
  maxTime?: string;
}

export const useTimeSelectorState = ({
  time,
  onTimeChange,
  isEndTime = false,
  startTime = "",
  minTime = "",
  maxTime = ""
}: UseTimeSelectorStateProps) => {
  // Parse the time string into components
  const [hour, setHour] = useState<string>("12");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("pm");

  // Parse time string into components on mount and when props change
  useEffect(() => {
    const { hour: newHour, minute: newMinute, period: newPeriod } = parseTimeString(time);
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
  }, [time]);

  // Check if current time is at minimum allowed time
  const checkIsAtMinTime = (): boolean => {
    return isAtMinTime(hour, minute, period, minTime, isEndTime, startTime);
  };
  
  // Check if current time is at maximum allowed time
  const checkIsAtMaxTime = (): boolean => {
    return isAtMaxTime(hour, minute, period, maxTime);
  };
  
  // Increment time by 15 minutes
  const handleIncrement = () => {
    console.log("🔼 Increment button clicked");
    
    const result = incrementTime(hour, minute, period, maxTime);
    
    if (result) {
      // Update state
      setHour(result.hour);
      setMinute(result.minute);
      setPeriod(result.period);
      
      // Notify parent with new time string
      console.log(`Calling onTimeChange with: "${result.timeString}"`);
      onTimeChange(result.timeString);
    }
  };
  
  // Decrement time by 15 minutes
  const handleDecrement = () => {
    console.log("🔽 Decrement button clicked");
    
    const result = decrementTime(hour, minute, period, minTime, isEndTime, startTime);
    
    if (result) {
      // Update state
      setHour(result.hour);
      setMinute(result.minute);
      setPeriod(result.period);
      
      // Notify parent with new time string
      console.log(`Calling onTimeChange with: "${result.timeString}"`);
      onTimeChange(result.timeString);
    }
  };

  return {
    hour,
    minute, 
    period,
    isAtMinTime: checkIsAtMinTime(),
    isAtMaxTime: checkIsAtMaxTime(),
    handleIncrement,
    handleDecrement
  };
};
