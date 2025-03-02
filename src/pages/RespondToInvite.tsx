
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMeeting } from "@/context/MeetingContext";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";
import InvitationHeader from "@/components/respond/InvitationHeader";
import TimeSlotSelection from "@/components/respond/TimeSlotSelection";
import InvalidInvitation from "@/components/respond/InvalidInvitation";

const RespondToInvite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inviteId } = useParams();
  const { 
    timeSlots, 
    setSelectedTimeSlot, 
    addParticipant, 
    addTimeSlot, 
    clearTimeSlots 
  } = useMeeting();
  
  const [isLoading, setIsLoading] = useState(true);
  const [inviteError, setInviteError] = useState<'invalid' | 'expired' | null>(null);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Burt");
  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");

  useEffect(() => {
    console.log("Loading invite data for ID:", inviteId);
    
    // Reset states
    setIsLoading(true);
    setInviteError(null);
    
    // Clear existing time slots first
    clearTimeSlots();
    
    const timer = setTimeout(() => {
      // Always generate demo time slots regardless of inviteId
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
      
      // Special handling for different invite types
      if (!inviteId) {
        setInviteError('invalid');
      } else if (inviteId.toLowerCase() === "burt_demo") {
        setCreatorName("Abby");
        setResponderName("Burt");
        demoTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
      } else if (inviteId.toLowerCase() === "demo_invite") {
        // For the main demo invite ID from TimeConfirmation page
        setCreatorName("Abby");
        setResponderName("Friend");
        demoTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
      } else {
        // For any other invite ID, use generic names based on the ID
        setCreatorName(`User-${inviteId.substring(0, 4)}`);
        setResponderName("Friend");
        
        // Add time slots for all valid invites
        demoTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
      }
      
      console.log("Added time slots:", demoTimeSlots);
      setIsLoading(false);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [inviteId, clearTimeSlots, addTimeSlot]);

  const handleSelectTimeSlot = (slot: TimeSlot, startTime: string, endTime: string) => {
    setCurrentSelectedSlot(slot);
    setCurrentStartTime(startTime);
    setCurrentEndTime(endTime);
  };

  const handleSubmit = () => {
    if (currentSelectedSlot) {
      addParticipant(responderName);
      setSelectedTimeSlot({
        ...currentSelectedSlot,
        startTime: currentStartTime,
        endTime: currentEndTime
      });
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

  if (isLoading) {
    return <InvalidInvitation reason="loading" />;
  }

  if (inviteError || timeSlots.length === 0) {
    return <InvalidInvitation reason={inviteError || 'invalid'} />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <InvitationHeader 
        creatorName={creatorName} 
        responderName={responderName} 
      />

      <div className="mb-6">
        <TimeSlotSelection
          timeSlots={timeSlots}
          responderName={responderName}
          creatorName={creatorName}
          onSelectTimeSlot={handleSelectTimeSlot}
          onCannotMakeIt={handleCantMakeIt}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default RespondToInvite;
