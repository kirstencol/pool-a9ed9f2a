
import { useState, useEffect, useMemo, useCallback } from "react";
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

  // Notify parent when time components change
  useEffect(() => {
    if (hour === "--" || period === "") {
      return;
    }
    
    const newTime = buildTimeString(hour, minute, period);
    if (newTime.toLowerCase() !== time.toLowerCase() && newTime !== "--") {
      onTimeChange(newTime);
    }
  }, [hour, minute, period, onTimeChange, time]);

  // Calculate time constraints
  const minTimeMinutes = useMemo(() => convertTimeToMinutes(minTime), [minTime]);
  const maxTimeMinutes = useMemo(() => convertTimeToMinutes(maxTime), [maxTime]);
  const startTimeMinutes = useMemo(() => isEndTime ? convertTimeToMinutes(startTime) : 0, [isEndTime, startTime]);

  // Calculate if we're at the minimum or maximum allowed values
  const currentTimeMinutes = useMemo(() => {
    if (hour === "--" || period === "") return 0;
    
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

  const effectiveMinTime = useMemo(() => 
    isEndTime && startTime ? Math.max(startTimeMinutes, minTimeMinutes) : minTimeMinutes, 
    [isEndTime, startTime, startTimeMinutes, minTimeMinutes]
  );

  const isAtMinTime = useMemo(() => {
    // Only apply constraints if min time is actually set
    if ((minTimeMinutes <= 0) && (!isEndTime || startTimeMinutes <= 0)) {
      return false;
    }
    return currentTimeMinutes <= effectiveMinTime;
  }, [currentTimeMinutes, effectiveMinTime, minTimeMinutes, isEndTime, startTimeMinutes]);

  const isAtMaxTime = useMemo(() => {
    // Only apply max constraint if max time is actually set
    if (maxTimeMinutes <= 0) {
      return false;
    }
    return currentTimeMinutes >= maxTimeMinutes;
  }, [currentTimeMinutes, maxTimeMinutes]);

  // Time increment/decrement functions (in 15-minute intervals)
  const adjustTime = useCallback((minutes: number) => {
    console.log("Adjusting time by minutes:", minutes);
    
    // Calculate new time in minutes
    let hourNum = parseInt(hour);
    let minuteNum = parseInt(minute);
    
    // Convert to 24-hour format for calculation
    if (period === "pm" && hourNum < 12) {
      hourNum += 12;
    } else if (period === "am" && hourNum === 12) {
      hourNum = 0;
    }
    
    // Total minutes in 24-hour format
    let totalMinutes = hourNum * 60 + minuteNum;
    let newTotalMinutes = totalMinutes + minutes;
    
    console.log("Current time (24h format):", `${hourNum}:${minuteNum}`);
    console.log("Current minutes since midnight:", totalMinutes);
    console.log("New minutes since midnight:", newTotalMinutes);
    
    // Apply constraints but only if they are actually set
    let skipConstraints = false;
    
    // For debugging, try skipping constraints entirely
    if (skipConstraints) {
      console.log("DEBUG MODE: Skipping time constraints");
    } else {
      const effectiveMinMinutes = isEndTime && startTime ? 
        Math.max(startTimeMinutes, minTimeMinutes) : minTimeMinutes;
      
      if (minutes > 0 && maxTimeMinutes > 0 && newTotalMinutes > maxTimeMinutes) {
        console.log("Cannot increment: would exceed max time limit of", maxTimeMinutes);
        return;
      }
      
      if (minutes < 0 && effectiveMinMinutes > 0 && newTotalMinutes < effectiveMinMinutes) {
        console.log("Cannot decrement: would go below min time limit of", effectiveMinMinutes);
        return;
      }
    }
    
    // Convert back to 12-hour format
    let newHours = Math.floor(newTotalMinutes / 60);
    const newMinutes = newTotalMinutes % 60;
    let newPeriod = newHours >= 12 ? "pm" : "am";
    
    if (newHours > 12) {
      newHours -= 12;
    } else if (newHours === 0) {
      newHours = 12;
    }
    
    console.log(`Setting new time: ${newHours}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`);
    
    // Update state - force as strings
    setHour(newHours.toString());
    setMinute(newMinutes.toString().padStart(2, '0'));
    setPeriod(newPeriod);
  }, [hour, minute, period, maxTimeMinutes, minTimeMinutes, startTimeMinutes, isEndTime, startTime]);

  const incrementTime = useCallback(() => {
    console.log("Increment time called");
    adjustTime(15);
  }, [adjustTime]);
  
  const decrementTime = useCallback(() => {
    console.log("Decrement time called");
    adjustTime(-15);
  }, [adjustTime]);

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
