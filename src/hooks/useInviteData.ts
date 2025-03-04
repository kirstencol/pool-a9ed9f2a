
import { useState, useEffect } from "react";
import { useMeeting } from "@/context/MeetingContext";
import { TimeSlot } from "@/types";

// Demo data for testing
const DEMO_TIME_SLOTS = [
  {
    id: "1",
    date: "March 1",
    startTime: "8:00 AM",
    endTime: "1:30 PM",
    responses: []
  },
  {
    id: "2",
    date: "March 2",
    startTime: "7:00 AM",
    endTime: "10:00 AM",
    responses: []
  },
  {
    id: "3",
    date: "March 3",
    startTime: "9:00 AM",
    endTime: "9:00 PM",
    responses: []
  }
];

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
    timeSlots
  } = useMeeting();
  
  const [isLoading, setIsLoading] = useState(true);
  const [inviteError, setInviteError] = useState<'invalid' | 'expired' | null>(null);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Friend");
  const [inviteTimeSlots, setInviteTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    console.log("useInviteData - Loading invite data for ID:", inviteId);
    console.log("useInviteData - Initial timeSlots state:", timeSlots);
    
    // Reset states
    setIsLoading(true);
    setInviteError(null);
    setInviteTimeSlots([]);
    
    // Clear existing time slots first
    console.log("useInviteData - About to clear time slots");
    clearTimeSlots();
    console.log("useInviteData - Time slots after clearing:", timeSlots);
    
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
      
      // Handle demo routes with consistent test data
      if (normalizedInviteId === "demo_invite") {
        console.log("useInviteData - Processing demo_invite case");
        setCreatorName("Abby");
        setResponderName("Friend");
        
        // Create a copy of the demo slots
        const demoSlots = [...DEMO_TIME_SLOTS];
        console.log("useInviteData - Demo slots to be added:", demoSlots);
        
        // Set our local state first
        setInviteTimeSlots(demoSlots);
        
        // Then update the context (one by one)
        demoSlots.forEach(slot => {
          console.log("useInviteData - Adding slot to context:", slot);
          addTimeSlot(slot);
        });
        
        console.log("useInviteData - Time slots after adding demo slots:", timeSlots);
        setIsLoading(false);
        console.log("useInviteData - Finished loading demo_invite data");
        return;
      } 
      
      if (normalizedInviteId === "burt_demo") {
        console.log("useInviteData - Processing burt_demo case");
        setCreatorName("Abby");
        setResponderName("Burt");
        
        // Instead of directly calling addTimeSlot, we'll set our local state first
        const demoSlots = [...DEMO_TIME_SLOTS];
        setInviteTimeSlots(demoSlots);
        
        // Also update the context
        demoSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        console.log("useInviteData - Time slots after adding Burt demo slots:", timeSlots);
        setIsLoading(false);
        console.log("useInviteData - Finished loading burt_demo data");
        return;
      }
      
      // Try to load meeting data from localStorage using inviteId for real invites
      const loadedMeeting = loadMeetingFromStorage(inviteId);
      
      if (loadedMeeting && loadedMeeting.timeSlots && loadedMeeting.timeSlots.length > 0) {
        // Use data from localStorage
        console.log("useInviteData - Loaded meeting data from storage:", loadedMeeting);
        
        if (loadedMeeting.creator && loadedMeeting.creator.name) {
          setCreatorName(loadedMeeting.creator.name);
        }
        
        // Extract time slots and update local state
        setInviteTimeSlots(loadedMeeting.timeSlots);
        
        // Also update the context
        loadedMeeting.timeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        console.log("useInviteData - Time slots after adding from storage:", timeSlots);
        setIsLoading(false);
      } else {
        // For any other invite ID that wasn't found in localStorage
        console.log("useInviteData - Invalid or missing data for inviteId:", inviteId);
        setInviteError('invalid');
        setIsLoading(false);
      }
    }, 600);
    
    return () => {
      clearTimeout(timer);
      console.log("useInviteData - Effect cleanup ran");
    };
  }, [inviteId, clearTimeSlots, addTimeSlot, loadMeetingFromStorage, timeSlots]); // Added timeSlots to watch it update

  // Add a separate effect to log when timeSlots change
  useEffect(() => {
    console.log("useInviteData - timeSlots changed:", timeSlots);
  }, [timeSlots]);

  return {
    isLoading,
    inviteError,
    creatorName,
    responderName,
    inviteTimeSlots
  };
};
