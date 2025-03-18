
/**
 * Validates that the end time is after the start time
 */
export const validateTimeRange = (startTime: string, endTime: string): boolean => {
  if (startTime === "--" || endTime === "--") {
    return true;
  }

  const parseTime = (timeStr: string) => {
    const match = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return null;

    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const period = match[3].toLowerCase();

    if (period === "pm" && hour < 12) hour += 12;
    if (period === "am" && hour === 12) hour = 0;

    return { hour, minute };
  };

  const start = parseTime(startTime);
  const end = parseTime(endTime);

  if (!start || !end) return true;

  if (start.hour > end.hour || (start.hour === end.hour && start.minute >= end.minute)) {
    return false;
  }

  return true;
};

/**
 * Checks if there are any valid time slots to submit
 */
export const hasValidTimeSlots = (timeSlots: {
  date: string;
  startTime: string;
  endTime: string;
  isValid: boolean;
}[]) => {
  return timeSlots.some(slot => 
    slot.date && slot.startTime !== "--" && slot.endTime !== "--" && slot.isValid
  );
};
