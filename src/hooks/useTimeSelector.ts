
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

  // Check if we're at the minimum allowed value
  const isMinHour = useMemo(() => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    const effectiveMinTime = isEndTime && startTime ? 
      Math.max(startTimeMinutes, minTimeMinutes) : 
      minTimeMinutes;
    
    return Math.floor(currentMinutes / 60) === Math.floor(effectiveMinTime / 60);
  }, [hour, minute, period, minTimeMinutes, startTimeMinutes, isEndTime, startTime]);

  const isMinMinute = useMemo(() => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    const effectiveMinTime = isEndTime && startTime ? 
      Math.max(startTimeMinutes, minTimeMinutes) : 
      minTimeMinutes;
    
    return isMinHour && (currentMinutes % 60) <= (effectiveMinTime % 60);
  }, [hour, minute, period, minTimeMinutes, startTimeMinutes, isEndTime, startTime, isMinHour]);

  // Check if we're at the maximum allowed value
  const isMaxHour = useMemo(() => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    
    return Math.floor(currentMinutes / 60) === Math.floor(maxTimeMinutes / 60);
  }, [hour, minute, period, maxTimeMinutes]);

  const isMaxMinute = useMemo(() => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    
    return isMaxHour && (currentMinutes % 60) >= (maxTimeMinutes % 60);
  }, [hour, minute, period, maxTimeMinutes, isMaxHour]);

  // Time increment/decrement functions 
  const incrementTime = useCallback((minutes: number) => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    const newTotalMinutes = currentMinutes + minutes;
    
    // Don't go beyond max time
    if (newTotalMinutes > maxTimeMinutes) {
      return;
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
  }, [hour, minute, period, maxTimeMinutes]);

  const decrementTime = useCallback((minutes: number) => {
    const currentTime = buildTimeString(hour, minute, period);
    const currentMinutes = convertTimeToMinutes(currentTime);
    const effectiveMinTime = isEndTime && startTime ? 
      Math.max(startTimeMinutes, minTimeMinutes) : 
      minTimeMinutes;
    
    const newTotalMinutes = currentMinutes - minutes;
    
    // Don't go below min time
    if (newTotalMinutes < effectiveMinTime) {
      return;
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
  }, [hour, minute, period, minTimeMinutes, startTimeMinutes, isEndTime, startTime]);

  // Increment/decrement hour and minute
  const incrementHour = useCallback(() => incrementTime(60), [incrementTime]);
  const decrementHour = useCallback(() => decrementTime(60), [decrementTime]);
  const incrementMinute = useCallback(() => incrementTime(15), [incrementTime]);
  const decrementMinute = useCallback(() => decrementTime(15), [decrementTime]);

  return {
    hour,
    minute,
    period,
    incrementHour,
    decrementHour,
    incrementMinute,
    decrementMinute,
    isMinHour,
    isMaxHour,
    isMinMinute,
    isMaxMinute
  };
};
