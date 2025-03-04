
import { TimeSlot } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";

interface ResponseSubmitterProps {
  currentSelectedSlot: TimeSlot | null;
  currentStartTime: string;
  currentEndTime: string;
  responderName: string;
  inviteId: string | undefined;
}

const ResponseSubmitter: React.FC<ResponseSubmitterProps> = ({
  currentSelectedSlot,
  currentStartTime,
  currentEndTime,
  responderName,
  inviteId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    addParticipant,
    setSelectedTimeSlot,
    loadMeetingFromStorage,
    storeMeetingInStorage
  } = useMeeting();

  const handleSubmit = () => {
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
      if (inviteId) {
        // Load existing meeting data first
        const existingMeeting = loadMeetingFromStorage(inviteId);
        if (existingMeeting) {
          // Add this response to the meeting data
          if (!existingMeeting.responses) existingMeeting.responses = [];
          existingMeeting.responses.push({
            name: responderName,
            timeSlotId: currentSelectedSlot.id,
            startTime: currentStartTime,
            endTime: currentEndTime
          });
          
          // Save the updated meeting data back to localStorage
          storeMeetingInStorage(inviteId, existingMeeting);
        }
      }
      
      toast({
        title: "Time confirmed!",
        description: "You're all set for the meetup.",
      });
      navigate("/select-location");
    }
  };

  const handleCantMakeIt = (e?: React.MouseEvent) => {
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
  };

  return {
    handleSubmit,
    handleCantMakeIt
  };
};

export default ResponseSubmitter;
