
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
        // Load meeting data from storage (either localStorage for demos or Supabase for real data)
        const meetingData = await loadMeetingFromStorage(inviteId);
        console.log("useInviteData - Loaded meeting data:", meetingData);
        
        if (!meetingData || !meetingData.timeSlots || meetingData.timeSlots.length === 0) {
          console.error("useInviteData - Invalid meeting data for invite:", inviteId);
          
          // For demo IDs, let's create some mock time slots to prevent errors
          if (inviteId === "carrie_demo" || inviteId === "burt_demo" || inviteId === "demo_invite") {
            console.log("Creating mock time slots for demo ID:", inviteId);
            
            // Create demo time slots
            const mockTimeSlots: TimeSlot[] = [
              {
                id: "1",
                date: "March 15",
                startTime: "3:00 PM",
                endTime: "5:00 PM",
                responses: []
              },
              {
                id: "2",
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
            
            setInviteTimeSlots(mockTimeSlots);
            setCreatorName("Abby");
            
            if (!userName) {
              setResponderName(inviteId === "burt_demo" ? "Burt" : 
                              inviteId === "carrie_demo" ? "Carrie" : "Burt");
            }
            
            setIsLoading(false);
            return;
          }
          
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
          
          // Special case for carrie_demo flow
          if (inviteId === "carrie_demo") {
            setResponderName("Carrie");
          } else {
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
          }
        } else {
          // Use the provided username
          setResponderName(userName);
        }
        
        setInviteTimeSlots(meetingData.timeSlots);
        setIsLoading(false);
      } catch (error) {
        console.error("useInviteData - Error loading invite data:", error);
        
        // For demo flows, create mock data instead of showing an error
        if (inviteId === "carrie_demo" || inviteId === "burt_demo" || inviteId === "demo_invite") {
          console.log("Creating fallback mock data for demo ID:", inviteId);
          
          const mockTimeSlots: TimeSlot[] = [
            {
              id: "1",
              date: "March 15",
              startTime: "3:00 PM",
              endTime: "5:00 PM",
              responses: []
            },
            {
              id: "2",
              date: "March 16",
              startTime: "2:00 PM",
              endTime: "4:00 PM",
              responses: []
            }
          ];
          
          setInviteTimeSlots(mockTimeSlots);
          setResponderName(inviteId === "burt_demo" ? "Burt" : 
                          inviteId === "carrie_demo" ? "Carrie" : 
                          userName || "Burt");
          setIsLoading(false);
          return;
        }
        
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
