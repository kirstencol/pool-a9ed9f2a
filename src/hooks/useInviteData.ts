
import { useState, useEffect } from "react";
import { TimeSlot } from "@/types";
import { useMeeting } from "@/context/meeting";
import { initializeDemoData } from "@/context/meeting/storage";

export const useInviteData = (inviteId: string, userName?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [inviteError, setInviteError] = useState<'invalid' | 'expired' | null>(null);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState(userName || "");
  const [inviteTimeSlots, setInviteTimeSlots] = useState<TimeSlot[]>([]);
  
  const { loadMeetingFromStorage } = useMeeting();

  useEffect(() => {
    // Initialize demo data to ensure it's available
    initializeDemoData();
    
    const fetchInviteData = async () => {
      console.log("useInviteData - Fetching data for invite:", inviteId);
      setIsLoading(true);
      setInviteError(null);
      
      try {
        const meetingData = loadMeetingFromStorage(inviteId);
        console.log("useInviteData - Loaded meeting data:", meetingData);
        
        if (!meetingData || !meetingData.timeSlots || meetingData.timeSlots.length === 0) {
          console.error("useInviteData - Invalid meeting data for invite:", inviteId);
          setInviteError('invalid');
          setIsLoading(false);
          return;
        }
        
        // Set the creator name
        if (meetingData.creator?.name) {
          setCreatorName(meetingData.creator.name);
        }
        
        // If userName wasn't provided, determine respondent based on existing responses
        if (!userName) {
          // Use default responder names if not specified
          const defaultResponders = ["Burt", "Carrie"];
          
          // Get names that have already responded
          const existingResponderNames = new Set();
          meetingData.timeSlots?.forEach((slot: any) => {
            if (slot.responses) {
              slot.responses.forEach((response: any) => {
                existingResponderNames.add(response.responderName);
              });
            }
          });
          
          console.log("useInviteData - Existing responder names:", Array.from(existingResponderNames));
          
          // Find the first default responder who hasn't responded yet
          const availableResponder = defaultResponders.find(name => !existingResponderNames.has(name));
          setResponderName(availableResponder || defaultResponders[0]);
        } else {
          // Use the provided username
          setResponderName(userName);
        }
        
        setInviteTimeSlots(meetingData.timeSlots);
        setIsLoading(false);
      } catch (error) {
        console.error("useInviteData - Error loading invite data:", error);
        setInviteError('invalid');
        setIsLoading(false);
      }
    };

    fetchInviteData();
  }, [inviteId, loadMeetingFromStorage, userName]);

  return {
    isLoading,
    inviteError,
    creatorName,
    responderName,
    inviteTimeSlots
  };
};
