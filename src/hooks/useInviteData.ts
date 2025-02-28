
import { useState, useEffect } from "react";
import { useMeeting } from "@/context/MeetingContext";
import { TimeSlot } from "@/types";

interface InviteData {
  isLoading: boolean;
  creatorName: string;
  responderName: string;
  timeSlots: TimeSlot[];
}

export const useInviteData = (inviteId: string | undefined): InviteData => {
  const { timeSlots, addTimeSlot, clearTimeSlots } = useMeeting();
  const [isLoading, setIsLoading] = useState(true);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Burt");

  useEffect(() => {
    console.log("Loading invite data for ID:", inviteId);
    
    // Reset time slots
    clearTimeSlots();
    
    // In a real app, you would fetch the data from an API using the inviteId
    // For now, we'll simulate by delaying a bit and using the demo data
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Check if we're using the special "burt_demo" ID that indicates we should load Abby's data
      // and show Burt's response view
      if (inviteId === "burt_demo") {
        setCreatorName("Abby");
        setResponderName("Burt");
        
        // Load Abby's time slots
        const abbyTimeSlots = [
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
        
        // Add each time slot to the context
        abbyTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        console.log("Added Abby's time slots for Burt to respond to:", abbyTimeSlots);
      } 
      // If it's a different inviteId, load demo data
      else if (timeSlots.length === 0) {
        // Demo data for testing when accessed directly via URL
        console.log("No time slots found, adding demo data");
        
        // Add demo time slots
        const demoTimeSlots = [
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
        
        // Add each demo time slot to the context
        demoTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        console.log("Added demo time slots:", demoTimeSlots);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [inviteId, timeSlots, addTimeSlot, clearTimeSlots]);

  return { isLoading, creatorName, responderName, timeSlots };
};
