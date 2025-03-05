
/**
 * Utility functions for time formatting and parsing
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
