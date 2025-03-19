
import { TimeSlot } from "@/types";
import { convertTimeToMinutes } from "@/utils/timeUtils";

export const calculateOverlappingTimeSlots = (timeSlotsWithResponses: TimeSlot[]) => {
  console.log("Calculating overlapping time slots from:", timeSlotsWithResponses);
  
  // We need to process all time slots regardless of responses, otherwise 
  // Burt's selections won't show correctly in the demo flow
  return timeSlotsWithResponses.map((slot: TimeSlot) => {
    console.log("Processing time slot:", slot);
    
    // Start with creator's full availability
    let overlapStartMinutes = convertTimeToMinutes(slot.startTime);
    let overlapEndMinutes = convertTimeToMinutes(slot.endTime);
    
    console.log("Initial overlap: ", overlapStartMinutes, overlapEndMinutes);
    
    // Flag to track if we have processed any responses
    let hasProcessedResponses = false;
    
    // Adjust based on each response
    if (slot.responses && slot.responses.length > 0) {
      slot.responses.forEach(response => {
        console.log("Processing response:", response);
        // Ensure we use fallback to slot times if response times aren't specified
        const responseStartMinutes = convertTimeToMinutes(response.startTime || slot.startTime);
        const responseEndMinutes = convertTimeToMinutes(response.endTime || slot.endTime);
        
        if (responseStartMinutes && responseEndMinutes) {
          // Update overlap to be the later start time
          overlapStartMinutes = Math.max(overlapStartMinutes, responseStartMinutes);
          
          // Update overlap to be the earlier end time
          overlapEndMinutes = Math.min(overlapEndMinutes, responseEndMinutes);
          
          hasProcessedResponses = true;
          console.log("Updated overlap: ", overlapStartMinutes, overlapEndMinutes);
        }
      });
    }
    
    // Only include slots where there's still a valid overlap
    if (overlapStartMinutes < overlapEndMinutes) {
      return {
        ...slot,
        overlapStartTime: formatMinutesToTime(overlapStartMinutes),
        overlapEndTime: formatMinutesToTime(overlapEndMinutes)
      };
    }
    
    // If there's no valid overlap, or no responses were processed,
    // return null so we can filter it out
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
