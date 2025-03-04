
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";
import { useMeeting } from "@/context/meeting";

interface TimeSlotSelection {
  slot: TimeSlot;
  startTime: string;
  endTime: string;
}

interface ResponseSubmitterProps {
  selectedTimeSlots: TimeSlotSelection[];
  responderName: string;
  inviteId: string | undefined;
}

export const useResponseSubmitter = ({
  selectedTimeSlots,
  responderName,
  inviteId
}: ResponseSubmitterProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { storeMeetingInStorage, loadMeetingFromStorage } = useMeeting();

  const handleSubmit = useCallback(() => {
    console.log("Submitting response with selected time slots:", selectedTimeSlots);

    if (!selectedTimeSlots || selectedTimeSlots.length === 0) {
      toast({
        title: "No time selected",
        description: "Please select at least one time that works for you.",
        variant: "destructive"
      });
      return;
    }

    if (!inviteId) {
      toast({
        title: "Missing invite ID",
        description: "There was an error with your invitation link.",
        variant: "destructive"
      });
      return;
    }
    
    // Load the existing meeting
    const meetingData = loadMeetingFromStorage(inviteId);
    if (!meetingData) {
      toast({
        title: "Error",
        description: "Could not find the meeting data.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the response to the meeting data
    const responses = meetingData.responses || [];
    
    // Add responses for each selected time slot
    selectedTimeSlots.forEach(selection => {
      responses.push({
        name: responderName,
        timeSlotId: selection.slot.id,
        startTime: selection.startTime,
        endTime: selection.endTime
      });
    });
    
    // Update the meeting data with the new responses
    meetingData.responses = responses;
    
    // Save the updated meeting data
    storeMeetingInStorage(inviteId, meetingData);
    
    // Show success toast
    toast({
      title: "Response submitted!",
      description: `Thanks ${responderName}, your availability has been saved.`,
      variant: "default"
    });
    
    // Navigate to confirmation page
    navigate("/confirmation");
  }, [selectedTimeSlots, responderName, inviteId, navigate, toast, storeMeetingInStorage, loadMeetingFromStorage]);

  const handleCantMakeIt = useCallback((e?: React.MouseEvent) => {
    e?.preventDefault?.();
    
    console.log("User can't make it");
    
    // Show toast
    toast({
      title: "Response submitted",
      description: `Sorry you can't make these times. We'll let ${responderName} know.`,
      variant: "default"
    });
    
    // Navigate to cannot-make-it page
    navigate("/cannot-make-it");
  }, [responderName, navigate, toast]);

  return {
    handleSubmit,
    handleCantMakeIt
  };
};
