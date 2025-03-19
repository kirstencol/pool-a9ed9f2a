
// src/components/respond/TimeSlotLoader.tsx
import { useEffect, useState, useCallback, useRef } from "react";
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
    loadMeetingFromStorage
  } = useMeeting();
  
  // Add a state to track if we've attempted to load
  const [loadAttempted, setLoadAttempted] = useState(false);
  // Add a ref to prevent multiple load callbacks
  const hasCalledLoadedCallback = useRef(false);

  // Use useCallback to prevent recreating this function on every render
  const loadTimeSlots = useCallback(async () => {
    console.log("TimeSlotLoader - Loading time slots for invite ID:", inviteId);
    
    if (loadAttempted) {
      console.log("TimeSlotLoader - Already attempted loading, skipping");
      return;
    }
    
    setLoadAttempted(true);
    
    try {
      // Remove duplicate time slots by using a Map with slot IDs as keys
      const uniqueTimeSlots = Array.from(
        new Map(timeSlots.map(slot => [slot.id, slot])).values()
      );
      
      if (uniqueTimeSlots.length > 0) {
        console.log("TimeSlotLoader - Using deduplicated time slots:", uniqueTimeSlots);
        setLocalTimeSlots(uniqueTimeSlots);
        
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded();
        }
        return; // Exit early if we already have time slots
      }
      
      if (!inviteId) {
        console.error("TimeSlotLoader - No invite ID provided");
        
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded(); // Mark as loaded to prevent infinite loading
        }
        return;
      }
      
      // Fallback: try to get time slots directly from storage
      console.log("TimeSlotLoader - Trying to load time slots directly for:", inviteId);
      
      const meeting = await loadMeetingFromStorage(inviteId);
      
      if (meeting?.timeSlots && meeting.timeSlots.length > 0) {
        console.log("TimeSlotLoader - Loaded time slots from storage:", meeting.timeSlots);
        setLocalTimeSlots(meeting.timeSlots);
        
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded();
        }
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
        
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded();
        }
      } else {
        console.error("TimeSlotLoader - No time slots found in meeting");
        
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded(); // Still mark as loaded, but with empty slots
        }
      }
    } catch (error) {
      console.error("TimeSlotLoader - Error loading time slots:", error);
      
      // Provide fallback data even on error for demo flows
      if (inviteId === "carrie_demo" || inviteId === "burt_demo" || inviteId === "demo_invite") {
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
        setLocalTimeSlots(mockTimeSlots);
      }
      
      if (!hasCalledLoadedCallback.current) {
        hasCalledLoadedCallback.current = true;
        onTimeSlotsLoaded(); // Mark as loaded even on error to prevent infinite loading
      }
    }
  }, [inviteId, loadMeetingFromStorage, onTimeSlotsLoaded, setLocalTimeSlots, timeSlots, loadAttempted]);

  // Run once on mount
  useEffect(() => {
    // Add a slight delay before loading to prevent rapid state changes
    const timer = setTimeout(() => {
      loadTimeSlots();
    }, 50);
    
    return () => clearTimeout(timer);
  }, [loadTimeSlots]);

  return null; // This is a logic-only component, no UI
};

export default TimeSlotLoader;
