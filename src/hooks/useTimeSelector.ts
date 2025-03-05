
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
  // Parse initial time string into components
  const parsedTime = parseTimeString(time);
  const [hour, setHour] = useState<string>(parsedTime.hour);
  const [minute, setMinute] = useState<string>(parsedTime.minute);
  const [period, setPeriod] = useState<string>(parsedTime.period);

  // Update component state when the time prop changes
  useEffect(() => {
    const { hour: newHour, minute: newMinute, period: newPeriod } = parseTimeString(time);
    setHour(newHour === "--" ? "12" : newHour);
    setMinute(newMinute);
    setPeriod(newPeriod || "pm");
  }, [time]);

  // Helper function to get current time in minutes
  const getCurrentTimeMinutes = useCallback(() => {
    let hourNum = parseInt(hour);
    let minuteNum = parseInt(minute);
    
    // Convert to 24-hour format for calculation
    if (period === "pm" && hourNum < 12) {
      hourNum += 12;
    } else if (period === "am" && hourNum === 12) {
      hourNum = 0;
    }
    
    return hourNum * 60 + minuteNum;
  }, [hour, minute, period]);

  // Get constraint time values in minutes
  const minTimeMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
  const maxTimeMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;
  const startTimeMinutes = isEndTime && startTime ? convertTimeToMinutes(startTime) : 0;
  
  // Effective minimum time considering both minTime and startTime (for end time)
  const effectiveMinTime = isEndTime && startTime ? 
    Math.max(startTimeMinutes, minTimeMinutes) : minTimeMinutes;

  // Checks if we're at min/max bounds
  const isAtMinTime = minTimeMinutes > 0 || (isEndTime && startTimeMinutes > 0) ? 
    getCurrentTimeMinutes() <= effectiveMinTime : false;
    
  const isAtMaxTime = maxTimeMinutes > 0 ? 
    getCurrentTimeMinutes() >= maxTimeMinutes : false;

  // Updates time values and calls the parent callback
  const updateTimeValues = useCallback((newHour: number, newMinutes: number, newPeriod: string) => {
    // Format values as strings
    const formattedHour = newHour.toString();
    const formattedMinute = newMinutes.toString().padStart(2, '0');
    
    // Update state
    setHour(formattedHour);
    setMinute(formattedMinute);
    setPeriod(newPeriod);
    
    // Notify parent
    const newTimeString = buildTimeString(formattedHour, formattedMinute, newPeriod);
    console.log("Updating time to:", newTimeString);
    onTimeChange(newTimeString);
  }, [onTimeChange]);

  // Increment time by 15 minutes
  const incrementTime = useCallback(() => {
    console.log("Increment time called");
    
    // Get current time in minutes
    const currentMinutes = getCurrentTimeMinutes();
    const newTotalMinutes = currentMinutes + 15;
    
    // Check if increment would exceed max time
    if (maxTimeMinutes > 0 && newTotalMinutes > maxTimeMinutes) {
      console.log("Cannot increment: would exceed max time of", maxTimeMinutes);
      return;
    }
    
    // Convert back to 12-hour format
    let newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;
    const newPeriod = newHours >= 12 ? "pm" : "am";
    
    // Convert hours to 12-hour format
    if (newHours > 12) {
      newHours -= 12;
    } else if (newHours === 0) {
      newHours = 12;
    }
    
    console.log(`Setting new time: ${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`);
    updateTimeValues(newHours, newMinutes, newPeriod);
  }, [getCurrentTimeMinutes, maxTimeMinutes, updateTimeValues]);
  
  // Decrement time by 15 minutes
  const decrementTime = useCallback(() => {
    console.log("Decrement time called");
    
    // Get current time in minutes
    const currentMinutes = getCurrentTimeMinutes();
    const newTotalMinutes = currentMinutes - 15;
    
    // Check if decrement would go below min time
    if (effectiveMinTime > 0 && newTotalMinutes < effectiveMinTime) {
      console.log("Cannot decrement: would go below min time of", effectiveMinTime);
      return;
    }
    
    // Convert back to 12-hour format
    let newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;
    const newPeriod = newHours >= 12 ? "pm" : "am";
    
    // Convert hours to 12-hour format
    if (newHours > 12) {
      newHours -= 12;
    } else if (newHours === 0) {
      newHours = 12;
    }
    
    console.log(`Setting new time: ${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`);
    updateTimeValues(newHours, newMinutes, newPeriod);
  }, [getCurrentTimeMinutes, effectiveMinTime, updateTimeValues]);

  return {
    hour,
    minute,
    period,
    incrementTime,
    decrementTime,
    isAtMinTime,
    isAtMaxTime
  };
};
