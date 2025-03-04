
import { useState, useEffect } from "react";
import { useMeeting } from "@/context/meeting";
import { TimeSlot } from "@/types";

// Demo time slots moved to storage.ts, we can reuse directly from there

interface UseInviteDataReturn {
  isLoading: boolean;
  inviteError: 'invalid' | 'expired' | null;
  creatorName: string;
  responderName: string;
  inviteTimeSlots: TimeSlot[];
}

export const useInviteData = (inviteId: string | undefined): UseInviteDataReturn => {
  const { 
    addTimeSlot, 
    clearTimeSlots,
    loadMeetingFromStorage,
  } = useMeeting();
  
  const [isLoading, setIsLoading] = useState(true);
  const [inviteError, setInviteError] = useState<'invalid' | 'expired' | null>(null);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Friend");
  const [inviteTimeSlots, setInviteTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    console.log("useInviteData - Loading invite data for ID:", inviteId);
    
    // Reset states
    setIsLoading(true);
    setInviteError(null);
    setInviteTimeSlots([]);
    
    // Clear existing time slots first
    console.log("useInviteData - About to clear time slots");
    clearTimeSlots();
    
    const timer = setTimeout(() => {
      if (!inviteId) {
        console.log("useInviteData - No inviteId provided");
        setInviteError('invalid');
        setIsLoading(false);
        return;
      }
      
      // Add explicit normalization and logging to see what's being processed
      const normalizedInviteId = inviteId.toLowerCase();
      console.log("useInviteData - Normalized inviteId:", normalizedInviteId);
      
      // Try to load meeting data from localStorage for ALL invite IDs
      const loadedMeeting = loadMeetingFromStorage(normalizedInviteId);
      console.log("useInviteData - Loaded meeting data:", loadedMeeting);
      
      if (loadedMeeting && loadedMeeting.timeSlots && loadedMeeting.timeSlots.length > 0) {
        // Use data from localStorage
        console.log("useInviteData - Using data from localStorage:", loadedMeeting);
        
        if (loadedMeeting.creator && loadedMeeting.creator.name) {
          setCreatorName(loadedMeeting.creator.name);
        }
        
        // Set responder name based on the invite ID (for demo cases)
        if (normalizedInviteId === "burt_demo") {
          setResponderName("Burt");
        } else {
          setResponderName("Friend");
        }
        
        // Extract time slots and update local state
        setInviteTimeSlots(loadedMeeting.timeSlots);
        
        // Also update the context
        loadedMeeting.timeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        setIsLoading(false);
      } else {
        // For any invite ID that wasn't found in localStorage (even after initialization)
        console.log("useInviteData - Invalid or missing data for inviteId:", inviteId);
        setInviteError('invalid');
        setIsLoading(false);
      }
    }, 600);
    
    return () => {
      clearTimeout(timer);
      console.log("useInviteData - Effect cleanup ran");
    };
  }, [inviteId, clearTimeSlots, addTimeSlot, loadMeetingFromStorage]);

  return {
    isLoading,
    inviteError,
    creatorName,
    responderName,
    inviteTimeSlots
  };
};
