
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
    loadMeetingFromStorage
  } = useMeeting();

  // Get timeSlots from context to ensure we're using the most up-to-date data
  useEffect(() => {
    console.log("TimeSlotLoader - Using timeSlots from context:", timeSlots);
    
    if (timeSlots && timeSlots.length > 0) {
      setLocalTimeSlots(timeSlots);
      onTimeSlotsLoaded();
    } else if (inviteId) {
      // Fallback: try to get time slots directly from storage
      console.log("TimeSlotLoader - Trying to load time slots directly from storage for:", inviteId);
      const storedMeeting = loadMeetingFromStorage(inviteId);
      if (storedMeeting?.timeSlots && storedMeeting.timeSlots.length > 0) {
        console.log("TimeSlotLoader - Loaded time slots from storage:", storedMeeting.timeSlots);
        setLocalTimeSlots(storedMeeting.timeSlots);
        
        // Add to context if not already there
        storedMeeting.timeSlots.forEach(slot => {
          // Only add if not already in context
          if (!timeSlots.some(ts => ts.id === slot.id)) {
            addTimeSlot(slot);
          }
        });
        
        onTimeSlotsLoaded();
      } else {
        console.error("TimeSlotLoader - Failed to load time slots from storage");
        // Ensure we finish loading even if there's an error
        onTimeSlotsLoaded();
      }
    }
  }, [timeSlots, inviteId, loadMeetingFromStorage, addTimeSlot, setLocalTimeSlots, onTimeSlotsLoaded]);

  return null; // This is a logic-only component, no UI
};

export default TimeSlotLoader;
