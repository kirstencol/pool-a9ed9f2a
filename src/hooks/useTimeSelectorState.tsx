
import { useState, useEffect, useCallback } from "react";
import { 
  parseTimeString, 
  buildTimeString, 
  incrementTime, 
  decrementTime, 
  isAtMinTime, 
  isAtMaxTime 
} from "@/utils/time";

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
  
  // We'll use this to force a re-render when time components change
  const [timeKey, setTimeKey] = useState<number>(0);

  // Parse time string into components on mount and when props change
  useEffect(() => {
    console.log(`useTimeSelectorState: time prop changed to "${time}"`);
    const { hour: newHour, minute: newMinute, period: newPeriod } = parseTimeString(time);
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
    console.log(`useTimeSelectorState: Updated state to ${newHour}:${newMinute} ${newPeriod}`);
  }, [time]);

  // Check if current time is at minimum allowed time
  const checkIsAtMinTime = useCallback((): boolean => {
    const result = isAtMinTime(hour, minute, period, minTime, isEndTime, startTime);
    console.log(`useTimeSelectorState: checkIsAtMinTime = ${result}`);
    return result;
  }, [hour, minute, period, minTime, isEndTime, startTime]);
  
  // Check if current time is at maximum allowed time
  const checkIsAtMaxTime = useCallback((): boolean => {
    const result = isAtMaxTime(hour, minute, period, maxTime);
    console.log(`useTimeSelectorState: checkIsAtMaxTime = ${result}`);
    return result;
  }, [hour, minute, period, maxTime]);

  // Update state and notify parent
  const updateTimeValues = useCallback((newHour: string, newMinute: string, newPeriod: string) => {
    console.log(`🔄 updateTimeValues called with: ${newHour}:${newMinute} ${newPeriod}`);
    console.log(`🔄 Previous state was: ${hour}:${minute} ${period}`);
    
    // Create a new time string to notify parent
    const newTimeString = buildTimeString(newHour, newMinute, newPeriod);
    console.log(`Calling onTimeChange with: "${newTimeString}"`);
    
    // Update internal state - do this first so the state is updated before the parent rerenders
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
    
    // Increment timeKey to force re-render
    setTimeKey(prevKey => prevKey + 1);
    
    // Then notify parent
    onTimeChange(newTimeString);
    
    console.log(`🔄 State after update call (but before render): ${hour}:${minute} ${period}`);
    
    // Schedule a log after the next render cycle
    setTimeout(() => {
      console.log(`🔄 State should be updated in next render to: ${newHour}:${newMinute} ${newPeriod}`);
    }, 0);
  }, [hour, minute, period, onTimeChange]);
  
  // Increment time by 15 minutes
  const handleIncrement = useCallback(() => {
    console.log("🔼 handleIncrement FUNCTION START");
    
    // Direct calculation approach
    const currentTimeString = buildTimeString(hour, minute, period);
    console.log(`Current time before increment: ${currentTimeString}`);
    
    // Perform the increment operation
    const result = incrementTime(hour, minute, period, maxTime);
    
    if (result) {
      console.log(`Increment result: ${result.hour}:${result.minute} ${result.period}`);
      // Make sure we're definitely calling updateTimeValues
      updateTimeValues(result.hour, result.minute, result.period);
    } else {
      console.log("Increment returned null - at max limit");
    }
  }, [hour, minute, period, maxTime, updateTimeValues]);
  
  // Decrement time by 15 minutes
  const handleDecrement = useCallback(() => {
    console.log("🔽 handleDecrement FUNCTION START");
    
    // Direct calculation approach
    const currentTimeString = buildTimeString(hour, minute, period);
    console.log(`Current time before decrement: ${currentTimeString}`);
    
    // Perform the decrement operation
    const result = decrementTime(hour, minute, period, minTime, isEndTime, startTime);
    
    if (result) {
      console.log(`Decrement result: ${result.hour}:${result.minute} ${result.period}`);
      // Make sure we're definitely calling updateTimeValues
      updateTimeValues(result.hour, result.minute, result.period);
    } else {
      console.log("Decrement returned null - at min limit");
    }
  }, [hour, minute, period, minTime, isEndTime, startTime, updateTimeValues]);

  // Add a render counter to track re-renders
  console.log(`🔄 useTimeSelectorState rendering with time: ${hour}:${minute} ${period}, timeKey: ${timeKey}`);

  return {
    hour,
    minute, 
    period,
    timeKey, // Add timeKey to force parent component to re-render
    isAtMinTime: checkIsAtMinTime(),
    isAtMaxTime: checkIsAtMaxTime(),
    handleIncrement,
    handleDecrement
  };
};
