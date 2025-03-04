
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import { useInviteData } from "@/hooks/useInviteData";
import { TimeSlot } from "@/types";
import TimeSlotSelection from "./TimeSlotSelection";

interface ResponseFormProps {
  creatorName: string;
  responderName: string;
  inviteId: string | undefined;
}

const ResponseForm: React.FC<ResponseFormProps> = ({
  creatorName,
  responderName,
  inviteId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    setSelectedTimeSlot, 
    addParticipant,
    loadMeetingFromStorage,
    storeMeetingInStorage
  } = useMeeting();
  
  // Get inviteTimeSlots directly from the hook
  const { inviteTimeSlots } = useInviteData(inviteId);

  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");

  // Log when the component renders with timeSlots
  console.log("ResponseForm rendering with inviteTimeSlots:", inviteTimeSlots);

  const handleSelectTimeSlot = (slot: TimeSlot, startTime: string, endTime: string) => {
    setCurrentSelectedSlot(slot);
    setCurrentStartTime(startTime);
    setCurrentEndTime(endTime);
    console.log("Selected time slot:", slot, startTime, endTime);
  };

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
      if (inviteId && inviteId !== "demo_invite" && inviteId !== "burt_demo") {
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

  const handleCantMakeIt = () => {
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

  return (
    <div className="mb-6">
      <TimeSlotSelection
        timeSlots={inviteTimeSlots}
        responderName={responderName}
        creatorName={creatorName}
        onSelectTimeSlot={handleSelectTimeSlot}
        onCannotMakeIt={handleCantMakeIt}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ResponseForm;
