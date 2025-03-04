
import { TimeSlot } from "@/types";
import { convertTimeToMinutes } from "@/utils/timeUtils";

export const calculateOverlappingTimeSlots = (timeSlotsWithResponses: TimeSlot[]) => {
  return timeSlotsWithResponses.map((slot: TimeSlot) => {
    // Start with creator's full availability
    let overlapStartMinutes = convertTimeToMinutes(slot.startTime);
    let overlapEndMinutes = convertTimeToMinutes(slot.endTime);
    
    // Adjust based on each response
    slot.responses?.forEach(response => {
      const responseStartMinutes = convertTimeToMinutes(response.startTime || "");
      const responseEndMinutes = convertTimeToMinutes(response.endTime || "");
      
      if (responseStartMinutes && responseEndMinutes) {
        // Update overlap to be the later start time
        overlapStartMinutes = Math.max(overlapStartMinutes, responseStartMinutes);
        
        // Update overlap to be the earlier end time
        overlapEndMinutes = Math.min(overlapEndMinutes, responseEndMinutes);
      }
    });
    
    // Only include slots where there's still a valid overlap
    if (overlapStartMinutes < overlapEndMinutes) {
      return {
        ...slot,
        overlapStartTime: formatMinutesToTime(overlapStartMinutes),
        overlapEndTime: formatMinutesToTime(overlapEndMinutes)
      };
    }
    return null;
  }).filter(Boolean);
};

// Format minutes back to time string (e.g., "9:30 AM")
export function formatMinutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
}
