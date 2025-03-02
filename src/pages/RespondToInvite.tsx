
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
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Burt");
  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");

  useEffect(() => {
    console.log("Loading invite data for ID:", inviteId);
    
    // Clear existing time slots first
    clearTimeSlots();
    
    // Define our demo time slots
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
    
    // Set names based on inviteId
    if (inviteId && inviteId.toLowerCase() === "burt_demo") {
      setCreatorName("Abby");
      setResponderName("Burt");
    } else {
      // For any other invite ID, use generic names
      setCreatorName(inviteId ? `User-${inviteId.substring(0, 4)}` : "Abby");
      setResponderName("Friend");
    }
    
    // Always add the demo time slots immediately
    demoTimeSlots.forEach(slot => {
      addTimeSlot(slot);
    });
    
    console.log("Added time slots immediately:", demoTimeSlots);
    
    // Set loading to false after a very short delay to ensure UI updates
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading set to false, timeSlots:", timeSlots);
    }, 100);
    
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

  if (timeSlots.length === 0) {
    return <InvalidInvitation />;
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
