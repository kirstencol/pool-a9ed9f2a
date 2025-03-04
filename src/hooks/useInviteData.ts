
import { useState, useEffect } from "react";
import { useMeeting } from "@/context/meeting";
import { TimeSlot } from "@/types";
import { initializeDemoData, ensureDemoDataExists } from "@/context/meeting/storage";

export const useInviteData = (inviteId: string | undefined): {
  isLoading: boolean;
  inviteError: 'invalid' | 'expired' | null;
  creatorName: string;
  responderName: string;
  inviteTimeSlots: TimeSlot[];
} => {
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
    
    const loadData = async () => {
      try {
        // First, ensure demo data exists (this returns a promise)
        await ensureDemoDataExists();
        
        // Now proceed to process the invite data
        if (!inviteId) {
          console.log("useInviteData - No inviteId provided, using demo_invite");
          processInviteData("demo_invite");
          return;
        }
        
        processInviteData(inviteId);
      } catch (error) {
        console.error("Error loading invite data:", error);
        setInviteError('invalid');
        setIsLoading(false);
      }
    };
    
    const processInviteData = (id: string) => {
      console.log("useInviteData - Processing invite data for ID:", id);
      
      // Add explicit normalization and logging to see what's being processed
      const normalizedInviteId = id.toLowerCase();
      console.log("useInviteData - Normalized inviteId:", normalizedInviteId);
      
      // Load meeting data
      const loadedMeeting = loadMeetingFromStorage(normalizedInviteId);
      console.log("useInviteData - Loaded meeting data:", loadedMeeting);
      
      // Validate meeting data
      if (!loadedMeeting || !loadedMeeting.timeSlots || loadedMeeting.timeSlots.length === 0) {
        console.error("useInviteData - Invalid meeting data:", loadedMeeting);
        setInviteError('invalid');
        setIsLoading(false);
        return;
      }
      
      console.log("useInviteData - Valid meeting data found:", loadedMeeting);
      
      // Update creator name if available
      if (loadedMeeting.creator && loadedMeeting.creator.name) {
        setCreatorName(loadedMeeting.creator.name);
      }
      
      // Set responder name based on the invite ID (for demo cases)
      if (normalizedInviteId === "burt_demo") {
        setResponderName("Burt");
      }
      
      // Clear time slots before adding new ones
      clearTimeSlots();
      
      // Extract time slots and update local state
      setInviteTimeSlots(loadedMeeting.timeSlots);
      
      // Also update the context
      loadedMeeting.timeSlots.forEach(slot => {
        addTimeSlot(slot);
      });
      
      // Complete loading
      setIsLoading(false);
    };
    
    loadData();
    
    return () => {
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
