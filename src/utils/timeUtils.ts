
/**
 * Utility functions for time manipulation and validation
 */

/**
 * Converts a time string (e.g., "2:30 pm") to minutes since midnight
 */
export const convertTimeToMinutes = (timeStr: string): number => {
  console.log(`convertTimeToMinutes called with: "${timeStr}"`);
  
  if (!timeStr || timeStr === "--") {
    console.log(`convertTimeToMinutes: Empty time string, returning 0`);
    return 0;
  }
  
  // Normalize the string: trim whitespace and convert to lowercase
  const normalizedTime = timeStr.trim().toLowerCase();
  console.log(`convertTimeToMinutes: Normalized to "${normalizedTime}"`);
  
  // Match HH:MM AM/PM format - include variants with or without space between time and AM/PM
  const timeRegex = /(\d+):(\d+)\s*(am|pm)/i;
  const match = normalizedTime.match(timeRegex);
  
  if (!match) {
    console.warn(`Time conversion failed: cannot parse "${timeStr}"`);
    return 0;
  }
  
  // Extract hours, minutes, and period
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toLowerCase();
  
  console.log(`convertTimeToMinutes: Parsed ${hours}:${minutes} ${period}`);
  
  // Validate hours and minutes
  if (isNaN(hours) || hours < 0 || hours > 12) {
    console.warn(`Time conversion failed: invalid hours in "${timeStr}"`);
    return 0;
  }
  
  if (isNaN(minutes) || minutes < 0 || minutes > 59) {
    console.warn(`Time conversion failed: invalid minutes in "${timeStr}"`);
    return 0;
  }
  
  // Convert to 24-hour format
  if (period === "pm" && hours < 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }
  
  const totalMinutes = (hours * 60) + minutes;
  console.log(`convertTimeToMinutes: "${timeStr}" = ${totalMinutes} minutes`);
  return totalMinutes;
};

/**
 * Parses a time string and returns its components
 */
export const parseTimeString = (time: string): { hour: string, minute: string, period: string } => {
  console.log(`parseTimeString called with: "${time}"`);
  
  if (!time || time === "--") {
    console.log(`parseTimeString: Using default for empty time "${time}"`);
    return { hour: "12", minute: "00", period: "pm" };
  }

  // Normalize the time string
  const normalizedTime = time.trim().toLowerCase();
  console.log(`parseTimeString: Normalized to "${normalizedTime}"`);
  
  // Match HH:MM AM/PM format with more forgiving regex
  const timeRegex = /(\d+):(\d+)\s*(am|pm)/i;
  const match = normalizedTime.match(timeRegex);
  
  if (!match) {
    console.warn(`parseTimeString: Failed to parse "${time}", using defaults`);
    return { hour: "12", minute: "00", period: "pm" };
  }
  
  // Get the hour, ensuring it's in 1-12 range
  let hourNum = parseInt(match[1], 10);
  if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) {
    console.warn(`parseTimeString: Invalid hour in "${time}", using default hour`);
    hourNum = 12;
  }
  
  // Get the minute, ensuring it's in 00-59 range
  let minuteNum = parseInt(match[2], 10);
  if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
    console.warn(`parseTimeString: Invalid minute in "${time}", using default minute`);
    minuteNum = 0;
  }
  
  // Get the period, ensuring it's either "am" or "pm"
  const period = match[3].toLowerCase();
  if (period !== "am" && period !== "pm") {
    console.warn(`parseTimeString: Invalid period in "${time}", using default period`);
    return { hour: hourNum.toString(), minute: minuteNum.toString().padStart(2, '0'), period: "pm" };
  }
  
  const result = {
    hour: hourNum.toString(),
    minute: minuteNum.toString().padStart(2, '0'),
    period
  };
  
  console.log(`parseTimeString: Successfully parsed "${time}" to:`, result);
  return result;
};

/**
 * Builds a time string from components
 */
export const buildTimeString = (hour: string, minute: string, period: string): string => {
  const formattedMinute = minute.padStart(2, '0');
  const formattedTime = `${hour}:${formattedMinute} ${period}`;
  console.log(`buildTimeString: Built time string: "${formattedTime}"`);
  return formattedTime;
};

/**
 * Determines if a time value is valid within given constraints
 */
export const isTimeWithinBounds = (
  testTime: string,
  minTime: string,
  maxTime: string,
  startTime?: string,
  isEndTime?: boolean
): boolean => {
  console.log(`isTimeWithinBounds called with: testTime="${testTime}", minTime="${minTime}", maxTime="${maxTime}", startTime="${startTime || ''}", isEndTime=${isEndTime}`);
  
  const testMinutes = convertTimeToMinutes(testTime);
  const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
  const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;
  
  // For end time, it must be after start time
  if (isEndTime && startTime && startTime !== "--") {
    const startMinutes = convertTimeToMinutes(startTime);
    const result = testMinutes > startMinutes && testMinutes <= maxMinutes;
    console.log(`isTimeWithinBounds (endTime): ${testTime} > ${startTime} && ${testTime} <= ${maxTime} = ${result}`);
    return result;
  } else {
    const result = testMinutes >= minMinutes && testMinutes <= maxMinutes;
    console.log(`isTimeWithinBounds: ${testTime} >= ${minTime} && ${testTime} <= ${maxTime} = ${result}`);
    return result;
  }
};
