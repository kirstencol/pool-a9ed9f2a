
import { useEffect } from "react";
import { TimeSlot } from "@/types";
import { useMeeting } from "@/context/meeting";

interface TimeSlotLoaderProps {
  inviteId: string | undefined;
  localTimeSlots: TimeSlot[];
  setLocalTimeSlots: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
  onTimeSlotsLoaded: () => void;
}

const TimeSlotLoader: React.FC<TimeSlotLoaderProps> = ({
  inviteId,
  localTimeSlots,
  setLocalTimeSlots,
  onTimeSlotsLoaded
}) => {
  const { 
    timeSlots,
    addTimeSlot,
    loadMeetingFromStorage,
    clearTimeSlots
  } = useMeeting();

  // Get timeSlots from context to ensure we're using the most up-to-date data
  useEffect(() => {
    // Add a short delay to ensure localStorage is properly initialized
    setTimeout(async () => {
      console.log("TimeSlotLoader - Using timeSlots from context:", timeSlots);
      
      // Remove duplicate time slots by using a Map with slot IDs as keys
      const uniqueTimeSlots = Array.from(
        new Map(timeSlots.map(slot => [slot.id, slot])).values()
      );
      
      if (uniqueTimeSlots.length > 0) {
        console.log("TimeSlotLoader - Using deduplicated time slots:", uniqueTimeSlots);
        setLocalTimeSlots(uniqueTimeSlots);
        onTimeSlotsLoaded();
      } else if (inviteId) {
        // Fallback: try to get time slots directly from storage
        console.log("TimeSlotLoader - Trying to load time slots directly from storage for:", inviteId);
        try {
          const storedMeeting = await loadMeetingFromStorage(inviteId);
          if (storedMeeting?.timeSlots && storedMeeting.timeSlots.length > 0) {
            // Clear existing time slots to prevent duplicates
            clearTimeSlots();
            
            console.log("TimeSlotLoader - Loaded time slots from storage:", storedMeeting.timeSlots);
            setLocalTimeSlots(storedMeeting.timeSlots);
            
            // Add to context if not already there
            storedMeeting.timeSlots.forEach(slot => {
              addTimeSlot(slot);
            });
            
            onTimeSlotsLoaded();
          } else {
            console.error("TimeSlotLoader - Failed to load time slots from storage");
            // Ensure we finish loading even if there's an error
            onTimeSlotsLoaded();
          }
        } catch (error) {
          console.error("TimeSlotLoader - Error loading time slots:", error);
          onTimeSlotsLoaded();
        }
      } else {
        onTimeSlotsLoaded();
      }
    }, 500); // Short delay to ensure storage is ready
  }, [timeSlots, inviteId, loadMeetingFromStorage, addTimeSlot, setLocalTimeSlots, onTimeSlotsLoaded, clearTimeSlots]);

  return null; // This is a logic-only component, no UI
};

export default TimeSlotLoader;
