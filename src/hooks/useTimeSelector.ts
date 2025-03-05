
import { useState, useEffect, useCallback } from "react";
import { parseTimeString, buildTimeString, convertTimeToMinutes } from "@/utils/timeUtils";

interface UseTimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  minTime?: string;
  maxTime?: string;
}

export const useTimeSelector = ({
  time,
  onTimeChange,
  isEndTime = false,
  startTime = "",
  minTime = "",
  maxTime = ""
}: UseTimeSelectorProps) => {
  console.log("useTimeSelector initial params:", { time, isEndTime, startTime, minTime, maxTime });

  // Parse initial time string into components
  const [hour, setHour] = useState<string>("12");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("pm");
  
  // Update component state when the time prop changes
  useEffect(() => {
    console.log(`useTimeSelector: time prop changed to "${time}"`);
    const { hour: newHour, minute: newMinute, period: newPeriod } = parseTimeString(time);
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
  }, [time]);
  
  // Calculate the time in minutes for current time values
  const getCurrentTimeMinutes = useCallback(() => {
    let hourNum = parseInt(hour);
    const minuteNum = parseInt(minute);
    
    // Convert to 24-hour format for calculation
    if (period === "pm" && hourNum < 12) {
      hourNum += 12;
    } else if (period === "am" && hourNum === 12) {
      hourNum = 0;
    }
    
    const totalMinutes = hourNum * 60 + minuteNum;
    console.log(`getCurrentTimeMinutes: ${hour}:${minute} ${period} = ${totalMinutes} minutes`);
    return totalMinutes;
  }, [hour, minute, period]);
  
  // Calculate constraint values
  const getTimeConstraints = useCallback(() => {
    const minTimeMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
    const maxTimeMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;
    const startTimeMinutes = startTime ? convertTimeToMinutes(startTime) : 0;
    
    // Effective minimum time is the max of minTime and startTime (for end time)
    const effectiveMinMinutes = isEndTime ? 
      Math.max(startTimeMinutes, minTimeMinutes) : minTimeMinutes;
      
    console.log("Time constraints:", { 
      minTimeMinutes, 
      maxTimeMinutes, 
      startTimeMinutes,
      effectiveMinMinutes,
      currentTimeMinutes: getCurrentTimeMinutes()
    });
    
    return {
      minTimeMinutes: effectiveMinMinutes,
      maxTimeMinutes
    };
  }, [minTime, maxTime, startTime, isEndTime, getCurrentTimeMinutes]);
  
  // Check if we're at min/max bounds
  const isAtMinTime = useCallback(() => {
    const currentMinutes = getCurrentTimeMinutes();
    const { minTimeMinutes } = getTimeConstraints();
    const result = currentMinutes <= minTimeMinutes;
    console.log(`isAtMinTime check: ${currentMinutes} <= ${minTimeMinutes} = ${result}`);
    return result;
  }, [getCurrentTimeMinutes, getTimeConstraints]);
  
  const isAtMaxTime = useCallback(() => {
    const currentMinutes = getCurrentTimeMinutes();
    const { maxTimeMinutes } = getTimeConstraints();
    const result = currentMinutes >= maxTimeMinutes;
    console.log(`isAtMaxTime check: ${currentMinutes} >= ${maxTimeMinutes} = ${result}`);
    return result;
  }, [getCurrentTimeMinutes, getTimeConstraints]);
  
  // Format time components and notify parent
  const updateTimeValues = useCallback((newHourNum: number, newMinuteNum: number, newPeriod: string) => {
    // Format values
    const formattedHour = newHourNum.toString();
    const formattedMinute = newMinuteNum.toString().padStart(2, '0');
    
    console.log(`updateTimeValues: Setting new time: ${formattedHour}:${formattedMinute} ${newPeriod}`);
    
    // Update local state
    setHour(formattedHour);
    setMinute(formattedMinute);
    setPeriod(newPeriod);
    
    // Notify parent component
    const newTimeString = buildTimeString(formattedHour, formattedMinute, newPeriod);
    console.log(`updateTimeValues: Calling onTimeChange with "${newTimeString}"`);
    onTimeChange(newTimeString);
  }, [onTimeChange]);
  
  // Convert minutes to 12-hour time format
  const minutesToTimeComponents = useCallback((totalMinutes: number) => {
    // Handle edge case
    if (totalMinutes < 0) totalMinutes = 0;
    if (totalMinutes >= 24 * 60) totalMinutes = 24 * 60 - 1;
    
    // Calculate hours in 24-hour format
    let hours24 = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // Convert to 12-hour format
    const period = hours24 >= 12 ? "pm" : "am";
    let hours12 = hours24 % 12;
    if (hours12 === 0) hours12 = 12;
    
    console.log(`minutesToTimeComponents: ${totalMinutes} minutes = ${hours12}:${minutes} ${period}`);
    return { hours: hours12, minutes, period };
  }, []);
  
  // Increment time by 15 minutes
  const incrementTime = useCallback(() => {
    console.log("incrementTime called");
    
    // Get current time and constraints
    const currentMinutes = getCurrentTimeMinutes();
    const { maxTimeMinutes } = getTimeConstraints();
    
    // Check if we can increment
    if (currentMinutes >= maxTimeMinutes) {
      console.log(`Cannot increment: ${currentMinutes} >= ${maxTimeMinutes}`);
      return;
    }
    
    // Calculate new time (increment by 15 min)
    const newTotalMinutes = Math.min(currentMinutes + 15, maxTimeMinutes);
    const { hours, minutes, period } = minutesToTimeComponents(newTotalMinutes);
    
    // Update state and notify parent
    updateTimeValues(hours, minutes, period);
  }, [getCurrentTimeMinutes, getTimeConstraints, minutesToTimeComponents, updateTimeValues]);
  
  // Decrement time by 15 minutes
  const decrementTime = useCallback(() => {
    console.log("decrementTime called");
    
    // Get current time and constraints
    const currentMinutes = getCurrentTimeMinutes();
    const { minTimeMinutes } = getTimeConstraints();
    
    // Check if we can decrement
    if (currentMinutes <= minTimeMinutes) {
      console.log(`Cannot decrement: ${currentMinutes} <= ${minTimeMinutes}`);
      return;
    }
    
    // Calculate new time (decrement by 15 min)
    const newTotalMinutes = Math.max(currentMinutes - 15, minTimeMinutes);
    const { hours, minutes, period } = minutesToTimeComponents(newTotalMinutes);
    
    // Update state and notify parent
    updateTimeValues(hours, minutes, period);
  }, [getCurrentTimeMinutes, getTimeConstraints, minutesToTimeComponents, updateTimeValues]);

  return {
    hour,
    minute,
    period,
    incrementTime,
    decrementTime,
    isAtMinTime: isAtMinTime(),
    isAtMaxTime: isAtMaxTime()
  };
};
