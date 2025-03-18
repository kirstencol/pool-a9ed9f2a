
// src/components/respond/TimeSlotLoader.tsx
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
    loadMeetingFromStorage,
    addTimeSlotsBatch
  } = useMeeting();

  // Get timeSlots from context to ensure we're using the most up-to-date data
  useEffect(() => {
    const loadTimeSlots = async () => {
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
        console.log("TimeSlotLoader - Trying to load time slots directly for:", inviteId);
        try {
          const meeting = await loadMeetingFromStorage(inviteId);
          
          if (meeting?.timeSlots && meeting.timeSlots.length > 0) {
            console.log("TimeSlotLoader - Loaded time slots from storage:", meeting.timeSlots);
            setLocalTimeSlots(meeting.timeSlots);
            onTimeSlotsLoaded();
          } else if (inviteId === "carrie_demo" || inviteId === "burt_demo" || inviteId === "demo_invite") {
            // Create fallback mock data for demo flows
            console.log("TimeSlotLoader - Creating mock time slots for demo");
            const mockTimeSlots: TimeSlot[] = [
              {
                id: "mock1",
                date: "March 15",
                startTime: "3:00 PM",
                endTime: "5:00 PM",
                responses: []
              },
              {
                id: "mock2",
                date: "March 16",
                startTime: "2:00 PM",
                endTime: "4:00 PM",
                responses: []
              }
            ];
            
            if (inviteId === "carrie_demo") {
              // Add Burt's response for Carrie's demo
              mockTimeSlots[0].responses = [
                {
                  responderName: "Burt",
                  startTime: "3:30 PM",
                  endTime: "5:00 PM"
                }
              ];
            }
            
            setLocalTimeSlots(mockTimeSlots);
            onTimeSlotsLoaded();
          } else {
            console.error("TimeSlotLoader - No time slots found in meeting");
            onTimeSlotsLoaded(); // Still mark as loaded, but with empty slots
          }
        } catch (error) {
          console.error("TimeSlotLoader - Error loading time slots:", error);
          onTimeSlotsLoaded(); // Mark as loaded even on error to prevent infinite loading
        }
      } else {
        console.error("TimeSlotLoader - No invite ID and no time slots in context");
        onTimeSlotsLoaded(); // Mark as loaded even on error to prevent infinite loading
      }
    };
    
    loadTimeSlots();
  }, [timeSlots, inviteId, loadMeetingFromStorage, setLocalTimeSlots, onTimeSlotsLoaded, addTimeSlotsBatch]);

  return null; // This is a logic-only component, no UI
};

export default TimeSlotLoader;
