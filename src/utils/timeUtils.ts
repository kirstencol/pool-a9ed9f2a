
/**
 * Utility functions for time manipulation and validation
 */

/**
 * Converts a time string (e.g., "2:30 pm") to minutes since midnight
 */
export const convertTimeToMinutes = (timeStr: string): number => {
  if (!timeStr || timeStr === "--") return 0;
  
  // Handle case insensitivity and normalize the string
  const normalizedTime = timeStr.trim().toLowerCase();
  
  // Try to match various time formats
  const match = normalizedTime.match(/(\d+):(\d+)\s?(am|pm)/i);
  if (!match) {
    console.warn(`Failed to parse time string: "${timeStr}"`);
    return 0;
  }
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toLowerCase();
  
  // Convert to 24-hour format
  if (period === "pm" && hours < 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }
  
  return hours * 60 + minutes;
};

/**
 * Parses a time string and returns its components
 */
export const parseTimeString = (time: string): { hour: string, minute: string, period: string } => {
  if (!time || time === "--") {
    return { hour: "12", minute: "00", period: "pm" };
  }

  // Normalize the time string
  const normalizedTime = time.trim().toLowerCase();
  
  const match = normalizedTime.match(/(\d+):(\d+)\s?(am|pm)/i);
  if (match) {
    return {
      hour: match[1],
      minute: match[2],
      period: match[3].toLowerCase()
    };
  }
  
  console.warn(`Failed to parse time components from: "${time}"`);
  return { hour: "12", minute: "00", period: "pm" };
};

/**
 * Builds a time string from components
 */
export const buildTimeString = (hour: string, minute: string, period: string): string => {
  return `${hour}:${minute} ${period}`;
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
  const testMinutes = convertTimeToMinutes(testTime);
  const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
  const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;
  
  if (isEndTime && startTime && startTime !== "--") {
    const startMinutes = convertTimeToMinutes(startTime);
    return testMinutes > startMinutes && testMinutes <= maxMinutes;
  } else {
    return testMinutes >= minMinutes && testMinutes < maxMinutes;
  }
};
