
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
    const currentTime = buildTimeString(hour, minute, period);
    return convertTimeToMinutes(currentTime);
  }, [hour, minute, period]);

  const effectiveMinTime = useMemo(() => 
    isEndTime && startTime ? Math.max(startTimeMinutes, minTimeMinutes) : minTimeMinutes, 
    [isEndTime, startTime, startTimeMinutes, minTimeMinutes]
  );

  const isAtMinTime = useMemo(() => 
    minTimeMinutes > 0 && currentTimeMinutes <= effectiveMinTime, 
    [currentTimeMinutes, effectiveMinTime, minTimeMinutes]
  );

  const isAtMaxTime = useMemo(() => 
    maxTimeMinutes > 0 && currentTimeMinutes >= maxTimeMinutes, 
    [currentTimeMinutes, maxTimeMinutes]
  );

  // Time increment/decrement functions (in 15-minute intervals)
  const adjustTime = useCallback((minutes: number) => {
    console.log("Adjusting time by minutes:", minutes);
    const currentTime = buildTimeString(hour, minute, period);
    console.log("Current time before adjustment:", currentTime);
    const currentMinutes = convertTimeToMinutes(currentTime);
    const newTotalMinutes = currentMinutes + minutes;
    
    console.log("Current minutes:", currentMinutes);
    console.log("New total minutes:", newTotalMinutes);
    console.log("Min time minutes:", minTimeMinutes);
    console.log("Max time minutes:", maxTimeMinutes);
    
    // Check constraints
    if (minutes > 0 && maxTimeMinutes > 0 && newTotalMinutes > maxTimeMinutes) {
      console.log("Cannot increment: would exceed max time");
      return;
    }
    
    if (minutes < 0) {
      const effectiveMinTime = isEndTime && startTime ? 
        Math.max(startTimeMinutes, minTimeMinutes) : 
        minTimeMinutes;
        
      if (effectiveMinTime > 0 && newTotalMinutes < effectiveMinTime) {
        console.log("Cannot decrement: would go below min time");
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
    
    console.log("Setting new time:", newHours, newMinutes, newPeriod);
    
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
