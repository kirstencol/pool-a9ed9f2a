
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
  // Track whether we've created fallback slots
  const createdFallbackSlots = useRef(false);

  // Use useCallback to prevent recreating this function on every render
  const loadTimeSlots = useCallback(async () => {
    console.log("TimeSlotLoader - Loading time slots for invite ID:", inviteId);
    
    if (loadAttempted) {
      console.log("TimeSlotLoader - Already attempted loading, skipping");
      return;
    }
    
    setLoadAttempted(true);
    
    try {
      // Check if we already have time slots in context
      if (timeSlots && timeSlots.length > 0) {
        // Remove duplicate time slots by using a Map with slot IDs as keys
        const uniqueTimeSlots = Array.from(
          new Map(timeSlots.map(slot => [slot.id, slot])).values()
        );
        
        if (uniqueTimeSlots.length > 0) {
          console.log("TimeSlotLoader - Using time slots from context:", uniqueTimeSlots);
          setLocalTimeSlots(uniqueTimeSlots);
          
          if (!hasCalledLoadedCallback.current) {
            console.log("TimeSlotLoader - Signaling time slots loaded from context");
            hasCalledLoadedCallback.current = true;
            setTimeout(() => onTimeSlotsLoaded(), 50);
          }
          return;
        }
      }
      
      if (!inviteId) {
        console.error("TimeSlotLoader - No invite ID provided");
        createFallbackTimeSlots();
        return;
      }
      
      // Try to get time slots directly from storage
      console.log("TimeSlotLoader - Trying to load time slots directly for:", inviteId);
      
      const meeting = await loadMeetingFromStorage(inviteId);
      
      if (meeting?.timeSlots && meeting.timeSlots.length > 0) {
        console.log("TimeSlotLoader - Loaded time slots from storage:", meeting.timeSlots);
        setLocalTimeSlots(meeting.timeSlots);
        
        if (!hasCalledLoadedCallback.current) {
          console.log("TimeSlotLoader - Signaling time slots loaded from storage");
          hasCalledLoadedCallback.current = true;
          setTimeout(() => onTimeSlotsLoaded(), 50);
        }
      } else {
        console.log("TimeSlotLoader - No time slots found in meeting, creating fallback");
        createFallbackTimeSlots();
      }
    } catch (error) {
      console.error("TimeSlotLoader - Error loading time slots:", error);
      createFallbackTimeSlots();
    }
  }, [inviteId, loadMeetingFromStorage, onTimeSlotsLoaded, setLocalTimeSlots, timeSlots, loadAttempted]);

  // Create fallback time slots for demo flows
  const createFallbackTimeSlots = useCallback(() => {
    if (createdFallbackSlots.current) return;
    createdFallbackSlots.current = true;
    
    console.log("TimeSlotLoader - Creating fallback time slots");
    
    // Create mock time slots for demo flows
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
      console.log("TimeSlotLoader - Signaling fallback time slots loaded");
      hasCalledLoadedCallback.current = true;
      setTimeout(() => onTimeSlotsLoaded(), 50);
    }
  }, [inviteId, onTimeSlotsLoaded, setLocalTimeSlots]);

  // Run once on mount
  useEffect(() => {
    // Add a slight delay before loading to prevent rapid state changes
    const timer = setTimeout(() => {
      loadTimeSlots();
    }, 50);
    
    // Force completion after a safety timeout
    const safetyTimer = setTimeout(() => {
      if (!hasCalledLoadedCallback.current) {
        console.log("TimeSlotLoader - Safety timeout reached, forcing completion");
        createFallbackTimeSlots();
      }
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [loadTimeSlots, createFallbackTimeSlots]);

  return null; // This is a logic-only component, no UI
};

export default TimeSlotLoader;
