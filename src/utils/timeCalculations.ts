
/**
 * Utility functions for time calculations and formatting
 */

// Convert time string to minutes for comparison
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr || timeStr === "--") return 0;
  
  const regex = /(\d+):(\d+)\s*(am|pm)/i;
  const match = timeStr.trim().toLowerCase().match(regex);
  
  if (!match) {
    console.warn(`Invalid time format: ${timeStr}`);
    return 0;
  }
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = match[3].toLowerCase();
  
  // Convert to 24-hour format
  if (ampm === "pm" && hours < 12) {
    hours += 12;
  } else if (ampm === "am" && hours === 12) {
    hours = 0;
  }
  
  return (hours * 60) + minutes;
};

// Parse time string into hour, minute, period components
export const parseTimeString = (time: string): { hour: string; minute: string; period: string } => {
  console.log(`parseTimeString: Parsing time string "${time}"`);
  const regex = /(\d+):(\d+)\s*(am|pm)/i;
  const match = time.trim().toLowerCase().match(regex);
  
  if (match) {
    const hour = match[1];
    const minute = match[2];
    const period = match[3].toLowerCase();
    
    console.log(`parseTimeString: Parsed time - ${hour}:${minute} ${period}`);
    return { hour, minute, period };
  } else {
    console.warn(`parseTimeString: Could not parse time "${time}", using defaults`);
    return { hour: "12", minute: "00", period: "pm" };
  }
};

// Build time string from components
export const buildTimeString = (hour: string, minute: string, period: string): string => {
  const formattedMinute = minute.padStart(2, '0');
  const formattedHour = hour.trim();
  const formattedPeriod = period.trim().toLowerCase();
  
  const result = `${formattedHour}:${formattedMinute} ${formattedPeriod}`;
  console.log(`buildTimeString: Created "${result}"`);
  return result;
};

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
