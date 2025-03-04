
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
    let isMounted = true;
    console.log("useInviteData - Loading invite data for ID:", inviteId);
    
    // IMPORTANT: Always initialize demo data first
    initializeDemoData();
    
    // Reset states but don't call setIsLoading(true) if it's already true
    // This helps prevent flickering
    setInviteError(null);
    
    // Add a global safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("useInviteData - Safety timeout reached, forcing load completion");
        setIsLoading(false);
        if (!inviteTimeSlots || inviteTimeSlots.length === 0) {
          setInviteError('invalid');
        }
      }
    }, 5000); // 5 second maximum wait time
    
    const loadDataWithRetry = async (id: string, retries = 2) => {
      console.log(`useInviteData - Loading data for ${id}, attempts left: ${retries}`);
      
      if (!isMounted) return;
      
      // First attempt to load
      let normalizedId = id.toLowerCase();
      let meetingData = loadMeetingFromStorage(normalizedId);
      
      // If no data and we have retries left, initialize again and retry
      if ((!meetingData || !meetingData.timeSlots || meetingData.timeSlots.length === 0) && retries > 0) {
        console.log("useInviteData - Data not found, initializing demo data again");
        initializeDemoData();
        
        // Short delay before retry
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!isMounted) return;
        return loadDataWithRetry(id, retries - 1);
      }
      
      if (!isMounted) return;
      
      if (!meetingData || !meetingData.timeSlots || meetingData.timeSlots.length === 0) {
        console.log("useInviteData - Failed to load data after retries");
        setInviteError('invalid');
        // Set loading to false to ensure we don't hang
        setIsLoading(false);
        return;
      }
      
      // Successfully loaded data
      console.log("useInviteData - Successfully loaded data:", meetingData);
      
      if (!isMounted) return;
      
      // Set creator name
      if (meetingData.creator && meetingData.creator.name) {
        setCreatorName(meetingData.creator.name);
      }
      
      // Set responder name based on ID
      if (normalizedId === "burt_demo") {
        setResponderName("Burt");
      }
      
      // Clear existing time slots
      clearTimeSlots();
      
      // Set time slots in state and context
      setInviteTimeSlots(meetingData.timeSlots);
      meetingData.timeSlots.forEach(slot => {
        addTimeSlot(slot);
      });
      
      // Set loading to false to show data
      setIsLoading(false);
    };
    
    // Start loading process with short delay to ensure consistent timing
    const timer = setTimeout(() => {
      const idToLoad = inviteId || "demo_invite";
      loadDataWithRetry(idToLoad);
    }, 300);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(safetyTimer);
      console.log("useInviteData - Effect cleanup ran");
    };
  }, [inviteId, clearTimeSlots, addTimeSlot, loadMeetingFromStorage, isLoading, inviteTimeSlots]);

  return {
    isLoading,
    inviteError,
    creatorName,
    responderName,
    inviteTimeSlots
  };
};
