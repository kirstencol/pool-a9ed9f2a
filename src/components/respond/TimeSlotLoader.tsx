
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
  
  const [loadAttempted, setLoadAttempted] = useState(false);
  const hasCalledLoadedCallback = useRef(false);
  const hasSetFallbackSlots = useRef(false);

  // Create fallback time slots for demo flows
  const createFallbackTimeSlots = useCallback(() => {
    if (hasSetFallbackSlots.current) return;
    hasSetFallbackSlots.current = true;
    
    console.log("TimeSlotLoader - CREATING FALLBACK TIME SLOTS");
    
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
      onTimeSlotsLoaded();
    }
  }, [inviteId, onTimeSlotsLoaded, setLocalTimeSlots]);

  // Use useCallback to prevent recreating this function on every render
  const loadTimeSlots = useCallback(async () => {
    console.log("TimeSlotLoader - Loading time slots for invite ID:", inviteId);
    
    if (loadAttempted) {
      console.log("TimeSlotLoader - Already attempted loading, skipping");
      return;
    }
    
    setLoadAttempted(true);
    
    try {
      // If we already have time slots locally, use them
      if (localTimeSlots && localTimeSlots.length > 0) {
        console.log("TimeSlotLoader - Already have local time slots, using them");
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded();
        }
        return;
      }
      
      // Check if we already have time slots in context
      if (timeSlots && timeSlots.length > 0) {
        console.log("TimeSlotLoader - Using time slots from context:", timeSlots);
        setLocalTimeSlots(timeSlots);
        
        if (!hasCalledLoadedCallback.current) {
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded();
        }
        return;
      }
      
      if (!inviteId) {
        console.error("TimeSlotLoader - No invite ID provided");
        createFallbackTimeSlots();
        return;
      }
      
      // Immediately create fallback slots for known demo IDs
      if (inviteId === "burt_demo" || inviteId === "carrie_demo" || inviteId === "demo_invite") {
        console.log("TimeSlotLoader - Known demo ID, creating fallback time slots");
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
          hasCalledLoadedCallback.current = true;
          onTimeSlotsLoaded();
        }
      } else {
        console.log("TimeSlotLoader - No time slots found in meeting, creating fallback");
        createFallbackTimeSlots();
      }
    } catch (error) {
      console.error("TimeSlotLoader - Error loading time slots:", error);
      createFallbackTimeSlots();
    }
  }, [inviteId, loadMeetingFromStorage, onTimeSlotsLoaded, setLocalTimeSlots, timeSlots, loadAttempted, localTimeSlots, createFallbackTimeSlots]);

  // Run once on mount
  useEffect(() => {
    // Add a slight delay before loading to prevent rapid state changes
    const timer = setTimeout(() => {
      loadTimeSlots();
    }, 50);
    
    // Force completion after a shorter safety timeout
    const safetyTimer = setTimeout(() => {
      if (!hasCalledLoadedCallback.current) {
        console.log("TimeSlotLoader - Safety timeout reached, forcing completion");
        createFallbackTimeSlots();
      }
    }, 2000); // Reduced from 3000ms for faster fallback
    
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, [loadTimeSlots, createFallbackTimeSlots]);

  // No render output - this is just a logic component
  return null;
};

export default TimeSlotLoader;
