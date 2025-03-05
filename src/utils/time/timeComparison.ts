
/**
 * Utility functions for time comparison
 */

import { timeToMinutes, buildTimeString } from './timeFormatting';

// Check if current time is at minimum allowed time
export const isAtMinTime = (
  hour: string, 
  minute: string, 
  period: string, 
  minTime?: string, 
  isEndTime = false, 
  startTime?: string
): boolean => {
  const currentTime = buildTimeString(hour, minute, period);
  const currentMinutes = timeToMinutes(currentTime);
  
  const minMinutes = minTime ? timeToMinutes(minTime) : 0;
  const startTimeMinutes = startTime ? timeToMinutes(startTime) : 0;
  
  const effectiveMinMinutes = isEndTime && startTime ? 
    Math.max(startTimeMinutes, minMinutes) : minMinutes;
  
  console.log(`Checking constraints: min=${effectiveMinMinutes}, max=N/A, current=${currentMinutes}`);
  
  const result = currentMinutes <= effectiveMinMinutes;
  console.log(`isAtMinTime: ${currentTime} (${currentMinutes} mins) <= ${minTime || "00:00 am"} (${minMinutes} mins) or ${startTime || "N/A"} (${startTimeMinutes} mins) = ${result}`);
  return result;
};

// Check if current time is at maximum allowed time
export const isAtMaxTime = (
  hour: string, 
  minute: string, 
  period: string, 
  maxTime?: string
): boolean => {
  const currentTime = buildTimeString(hour, minute, period);
  const currentMinutes = timeToMinutes(currentTime);
  
  const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1;
  
  console.log(`Checking constraints: min=N/A, max=${maxMinutes}, current=${currentMinutes}`);
  
  const result = currentMinutes >= maxMinutes;
  console.log(`isAtMaxTime: ${currentTime} (${currentMinutes} mins) >= ${maxTime || "11:59 pm"} (${maxMinutes} mins) = ${result}`);
  return result;
};
