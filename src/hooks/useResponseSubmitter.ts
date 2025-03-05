
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
  const { loadMeetingFromStorage, respondToTimeSlot } = useMeeting();

  const handleSubmit = useCallback(async () => {
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
    
    try {
      // Load the existing meeting
      const meetingData = await loadMeetingFromStorage(inviteId);
      if (!meetingData) {
        toast({
          title: "Error",
          description: "Could not find the meeting data.",
          variant: "destructive"
        });
        return;
      }
      
      // Add responses for each selected time slot
      for (const selection of selectedTimeSlots) {
        await respondToTimeSlot(
          selection.slot.id,
          responderName,
          selection.startTime,
          selection.endTime
        );
      }
      
      // Show success toast
      toast({
        title: "Response submitted!",
        description: `Thanks ${responderName}, your availability has been saved.`,
        variant: "default"
      });
      
      // Navigate to confirmation page with the invite ID
      navigate(`/confirmation?id=${inviteId}`);
    } catch (error) {
      console.error("Error submitting response:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your response.",
        variant: "destructive"
      });
    }
  }, [selectedTimeSlots, responderName, inviteId, navigate, toast, loadMeetingFromStorage, respondToTimeSlot]);

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
    navigate("/confirmation");
  }, [responderName, navigate, toast]);

  return {
    handleSubmit,
    handleCantMakeIt
  };
};
