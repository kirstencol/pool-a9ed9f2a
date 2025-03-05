
/**
 * Utility functions for time incrementation and decrementation
 */

import { buildTimeString } from './timeFormatting';
import { timeToMinutes } from './timeFormatting';
import { isAtMinTime, isAtMaxTime } from './timeComparison';

// Time increment logic
export const incrementTime = (
  hour: string, 
  minute: string, 
  period: string, 
  maxTime?: string
): { hour: string; minute: string; period: string; timeString: string } | null => {
  console.log(`incrementTime called with: ${hour}:${minute} ${period}, maxTime: ${maxTime || 'none'}`);
  
  // Convert current time to minutes for calculation
  let hours = parseInt(hour);
  let minutes = parseInt(minute);
  const currentPeriod = period.toLowerCase();
  
  // Handle potential parsing issues
  if (isNaN(hours) || isNaN(minutes)) {
    console.error("Invalid time values:", { hour, minute });
    return null;
  }
  
  // Convert to 24-hour format for calculation
  let hours24 = hours;
  if (currentPeriod === "pm" && hours < 12) {
    hours24 += 12;
  } else if (currentPeriod === "am" && hours === 12) {
    hours24 = 0;
  }
  
  // Add 15 minutes
  let totalMinutes = (hours24 * 60) + minutes + 15;
  
  // Round to nearest 15-minute interval if not already aligned
  totalMinutes = Math.round(totalMinutes / 15) * 15;
  
  // Check if exceeding max time
  const currentMinutes = (hours24 * 60) + minutes;
  const maxMinutes = maxTime ? timeToMinutes(maxTime) : 24 * 60 - 1;
  
  console.log(`Checking constraints: min=N/A, max=${maxMinutes}, current=${currentMinutes}`);
  console.log(`After increment would be: ${totalMinutes} minutes`);
  
  if (maxTime && totalMinutes > maxMinutes) {
    console.log(`Cannot increment: ${totalMinutes} > ${maxMinutes} (max time limit)`);
    return null;
  }
  
  // Convert back to 12-hour format
  const newHours24 = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  const newPeriod = newHours24 >= 12 ? "pm" : "am";
  let newHours12 = newHours24 % 12;
  if (newHours12 === 0) newHours12 = 12;
  
  console.log(`Incrementing from ${hours}:${minutes} ${currentPeriod} to ${newHours12}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`);
  
  return {
    hour: newHours12.toString(),
    minute: newMinutes.toString().padStart(2, '0'),
    period: newPeriod,
    timeString: buildTimeString(newHours12.toString(), newMinutes.toString().padStart(2, '0'), newPeriod)
  };
};

// Time decrement logic
export const decrementTime = (
  hour: string, 
  minute: string, 
  period: string, 
  minTime?: string, 
  isEndTime = false, 
  startTime?: string
): { hour: string; minute: string; period: string; timeString: string } | null => {
  console.log(`decrementTime called with: ${hour}:${minute} ${period}, minTime: ${minTime || 'none'}, isEndTime: ${isEndTime}, startTime: ${startTime || 'none'}`);
  
  // Convert current time to minutes for calculation
  let hours = parseInt(hour);
  let minutes = parseInt(minute);
  const currentPeriod = period.toLowerCase();
  
  // Handle potential parsing issues
  if (isNaN(hours) || isNaN(minutes)) {
    console.error("Invalid time values:", { hour, minute });
    return null;
  }
  
  // Convert to 24-hour format for calculation
  let hours24 = hours;
  if (currentPeriod === "pm" && hours < 12) {
    hours24 += 12;
  } else if (currentPeriod === "am" && hours === 12) {
    hours24 = 0;
  }
  
  // Subtract 15 minutes
  let totalMinutes = (hours24 * 60) + minutes - 15;
  
  // Round to nearest 15-minute interval if not already aligned
  totalMinutes = Math.round(totalMinutes / 15) * 15;
  
  // Calculate minimum allowed time
  const minMinutes = minTime ? timeToMinutes(minTime) : 0;
  const startTimeMinutes = startTime ? timeToMinutes(startTime) : 0;
  const effectiveMinMinutes = isEndTime && startTime ? 
    Math.max(startTimeMinutes, minMinutes) : minMinutes;
  
  // Current time in minutes
  const currentMinutes = (hours24 * 60) + minutes;
  
  console.log(`Checking constraints: min=${effectiveMinMinutes}, max=N/A, current=${currentMinutes}`);
  console.log(`After decrement would be: ${totalMinutes} minutes`);
  
  // Check if below minimum allowed time
  if (totalMinutes < effectiveMinMinutes) {
    console.log(`Cannot decrement: ${totalMinutes} < ${effectiveMinMinutes} (minimum time limit)`);
    return null;
  }
  
  // Convert back to 12-hour format
  const newHours24 = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  const newPeriod = newHours24 >= 12 ? "pm" : "am";
  let newHours12 = newHours24 % 12;
  if (newHours12 === 0) newHours12 = 12;
  
  console.log(`Decrementing from ${hours}:${minutes} ${currentPeriod} to ${newHours12}:${newMinutes.toString().padStart(2, '0')} ${newPeriod}`);
  
  return {
    hour: newHours12.toString(),
    minute: newMinutes.toString().padStart(2, '0'),
    period: newPeriod,
    timeString: buildTimeString(newHours12.toString(), newMinutes.toString().padStart(2, '0'), newPeriod)
  };
};
