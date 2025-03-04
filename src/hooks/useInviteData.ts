
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
}

export const useInviteData = (inviteId: string | undefined): UseInviteDataReturn => {
  const { 
    timeSlots,
    addTimeSlot, 
    clearTimeSlots,
    loadMeetingFromStorage
  } = useMeeting();
  
  const [isLoading, setIsLoading] = useState(true);
  const [inviteError, setInviteError] = useState<'invalid' | 'expired' | null>(null);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Friend");

  useEffect(() => {
    console.log("Loading invite data for ID:", inviteId);
    
    // Reset states
    setIsLoading(true);
    setInviteError(null);
    
    // Clear existing time slots first
    clearTimeSlots();
    
    const timer = setTimeout(() => {
      if (!inviteId) {
        setInviteError('invalid');
        setIsLoading(false);
        return;
      }
      
      // Handle demo routes with consistent test data
      if (inviteId.toLowerCase() === "demo_invite") {
        setCreatorName("Abby");
        setResponderName("Friend");
        DEMO_TIME_SLOTS.forEach(slot => {
          addTimeSlot(slot);
        });
        setIsLoading(false);
        return;
      } 
      
      if (inviteId.toLowerCase() === "burt_demo") {
        setCreatorName("Abby");
        setResponderName("Burt");
        DEMO_TIME_SLOTS.forEach(slot => {
          addTimeSlot(slot);
        });
        setIsLoading(false);
        return;
      }
      
      // Try to load meeting data from localStorage using inviteId for real invites
      const loadedMeeting = loadMeetingFromStorage(inviteId);
      
      if (loadedMeeting && loadedMeeting.timeSlots && loadedMeeting.timeSlots.length > 0) {
        // Use data from localStorage
        console.log("Loaded meeting data from storage:", loadedMeeting);
        
        if (loadedMeeting.creator && loadedMeeting.creator.name) {
          setCreatorName(loadedMeeting.creator.name);
        }
        
        // Extract time slots
        loadedMeeting.timeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        setIsLoading(false);
      } else {
        // For any other invite ID that wasn't found in localStorage
        setInviteError('invalid');
        setIsLoading(false);
      }
      
      console.log("Time slots loaded:", timeSlots);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [inviteId, clearTimeSlots, addTimeSlot, loadMeetingFromStorage, timeSlots]);

  return {
    isLoading,
    inviteError,
    creatorName,
    responderName
  };
};
