
import { TimeSlot } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import { useState, useCallback } from "react";

interface ResponseSubmitterProps {
  currentSelectedSlot: TimeSlot | null;
  currentStartTime: string;
  currentEndTime: string;
  responderName: string;
  inviteId: string | undefined;
}

// Create a custom hook for the response submission logic
export const useResponseSubmitter = ({
  currentSelectedSlot,
  currentStartTime,
  currentEndTime,
  responderName,
  inviteId
}: ResponseSubmitterProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    addParticipant,
    setSelectedTimeSlot,
    loadMeetingFromStorage,
    storeMeetingInStorage
  } = useMeeting();

  const handleSubmit = useCallback(async () => {
    if (currentSelectedSlot) {
      // Add the responder as a participant
      addParticipant(responderName);
      
      // Update the selected time slot
      setSelectedTimeSlot({
        ...currentSelectedSlot,
        startTime: currentStartTime,
        endTime: currentEndTime
      });
      
      // If we have a valid inviteId, record this response in localStorage
      if (inviteId && storeMeetingInStorage) {
        try {
          // Load existing meeting data first
          const existingMeeting = await loadMeetingFromStorage(inviteId);
          if (existingMeeting) {
            // Create a storable meeting object
            const meetingToStore = {
              id: existingMeeting.id,
              creator: existingMeeting.creator,
              timeSlots: existingMeeting.timeSlots,
              selectedTimeSlot: existingMeeting.selectedTimeSlot,
              locations: existingMeeting.locations,
              selectedLocation: existingMeeting.selectedLocation,
              notes: existingMeeting.notes,
              responses: []
            };
            
            // Add this response to the meeting data
            if (!meetingToStore.responses) meetingToStore.responses = [];
            meetingToStore.responses.push({
              responderName: responderName,
              timeSlotId: currentSelectedSlot.id,
              startTime: currentStartTime,
              endTime: currentEndTime
            });
            
            // Save the updated meeting data back to localStorage
            storeMeetingInStorage(inviteId, meetingToStore);
          }
        } catch (error) {
          console.error("Error updating meeting data:", error);
        }
      }
      
      toast({
        title: "Time confirmed!",
        description: "You're all set for the meetup.",
      });
      navigate("/select-location");
    }
  }, [currentSelectedSlot, currentStartTime, currentEndTime, responderName, inviteId, addParticipant, setSelectedTimeSlot, loadMeetingFromStorage, storeMeetingInStorage, navigate, toast]);

  const handleCantMakeIt = useCallback((e?: React.MouseEvent) => {
    if (responderName === "Burt" && currentSelectedSlot?.id === "3") {
      toast({
        title: "Not available",
        description: "Burt is not available on March 3rd.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "That's okay!",
        description: "We'll let them know you can't make these times.",
        variant: "destructive"
      });
    }
    navigate("/");
  }, [responderName, currentSelectedSlot, toast, navigate]);

  return {
    handleSubmit,
    handleCantMakeIt
  };
};

// This is just a wrapper component that renders nothing but provides the handlers
const ResponseSubmitter: React.FC<ResponseSubmitterProps> = (props) => {
  // We don't actually render anything here, we just provide the handlers
  // via the hook, but to satisfy React.FC we return null
  return null;
};

export default ResponseSubmitter;
