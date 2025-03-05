
import { useState, useEffect, useMemo, useCallback } from "react";
import { parseTimeString, buildTimeString, isTimeWithinBounds, convertTimeToMinutes } from "@/utils/timeUtils";

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
    currentTimeMinutes <= effectiveMinTime, 
    [currentTimeMinutes, effectiveMinTime]
  );

  const isAtMaxTime = useMemo(() => 
    currentTimeMinutes >= maxTimeMinutes, 
    [currentTimeMinutes, maxTimeMinutes]
  );

  // Time increment/decrement functions (in 15-minute intervals)
  const adjustTime = useCallback((minutes: number) => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    const newTotalMinutes = currentMinutes + minutes;
    
    // Check constraints
    if (minutes > 0 && newTotalMinutes > maxTimeMinutes) {
      return;
    }
    
    if (minutes < 0) {
      const effectiveMinTime = isEndTime && startTime ? 
        Math.max(startTimeMinutes, minTimeMinutes) : 
        minTimeMinutes;
        
      if (newTotalMinutes < effectiveMinTime) {
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
    
    setHour(newHours.toString());
    setMinute(newMinutes.toString().padStart(2, '0'));
    setPeriod(newPeriod);
  }, [hour, minute, period, maxTimeMinutes, minTimeMinutes, startTimeMinutes, isEndTime, startTime]);

  const incrementTime = useCallback(() => adjustTime(15), [adjustTime]);
  const decrementTime = useCallback(() => adjustTime(-15), [adjustTime]);

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
