
import { useState, useEffect } from "react";
import { useMeeting } from "@/context/meeting";
import { TimeSlot } from "@/types";
import { initializeDemoData } from "@/context/meeting/storage";

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
    
    // Ensure demo data is initialized first
    initializeDemoData();
    
    const timer = setTimeout(() => {
      if (!inviteId) {
        console.log("useInviteData - No inviteId provided, using demo_invite");
        processInviteData("demo_invite");
        return;
      }
      
      processInviteData(inviteId);
    }, 300);
    
    const processInviteData = (id: string) => {
      console.log("useInviteData - About to check for demo data");
      
      // Add explicit normalization and logging to see what's being processed
      const normalizedInviteId = id.toLowerCase();
      console.log("useInviteData - Normalized inviteId:", normalizedInviteId);
      
      // Load meeting data BEFORE clearing time slots
      const loadedMeeting = loadMeetingFromStorage(normalizedInviteId);
      console.log("useInviteData - Loaded meeting data:", loadedMeeting);
      
      // 🔥 Fix: Ensure demo data is ready before proceeding
      if (!loadedMeeting || !loadedMeeting.timeSlots || loadedMeeting.timeSlots.length === 0) {
        console.log("useInviteData - Data not found, waiting...");
        
        // Try initializing demo data again if this is a demo case
        if (normalizedInviteId === "demo_invite" || normalizedInviteId === "burt_demo") {
          console.log("useInviteData - Initializing demo data again");
          initializeDemoData();
        }
        
        setTimeout(() => {
          const retryLoadedMeeting = loadMeetingFromStorage(normalizedInviteId);
          console.log("useInviteData - Retry loaded meeting:", retryLoadedMeeting);
          
          if (retryLoadedMeeting && retryLoadedMeeting.timeSlots && retryLoadedMeeting.timeSlots.length > 0) {
            console.log("useInviteData - Successfully loaded data on retry");
            
            if (retryLoadedMeeting.creator && retryLoadedMeeting.creator.name) {
              setCreatorName(retryLoadedMeeting.creator.name);
            }
            
            // Set responder name based on the invite ID (for demo cases)
            if (normalizedInviteId === "burt_demo") {
              setResponderName("Burt");
            }
            
            // Only clear time slots AFTER we've confirmed we have data
            clearTimeSlots();
            console.log("useInviteData - Cleared time slots after ensuring data exists");
            
            // Extract time slots and update local state
            setInviteTimeSlots(retryLoadedMeeting.timeSlots);
            
            // Also update the context
            retryLoadedMeeting.timeSlots.forEach(slot => {
              addTimeSlot(slot);
            });
          } else {
            console.log("useInviteData - Data still missing after retry");
            setInviteError('invalid');
          }
          
          // Only set loading to false after we're done processing
          setIsLoading(false);
        }, 500);
        
        return;
      }
      
      console.log("useInviteData - Using stored invite data:", loadedMeeting);
      
      // Only clear time slots after we've confirmed we have data
      clearTimeSlots();
      console.log("useInviteData - Cleared time slots after ensuring data exists");
      
      if (loadedMeeting.creator && loadedMeeting.creator.name) {
        setCreatorName(loadedMeeting.creator.name);
      }
      
      // Set responder name based on the invite ID (for demo cases)
      if (normalizedInviteId === "burt_demo") {
        setResponderName("Burt");
      }
      
      // Extract time slots and update local state
      setInviteTimeSlots(loadedMeeting.timeSlots);
      
      // Also update the context
      loadedMeeting.timeSlots.forEach(slot => {
        addTimeSlot(slot);
      });
      
      // Only set loading to false after we're done processing
      setIsLoading(false);
    };
    
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
