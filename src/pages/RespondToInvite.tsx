
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMeeting } from "@/context/MeetingContext";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";
import InvitationHeader from "@/components/respond/InvitationHeader";
import TimeSlotSelection from "@/components/respond/TimeSlotSelection";
import InvalidInvitation from "@/components/respond/InvalidInvitation";

// Demo data for testing
const DEMO_TIME_SLOTS = [
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

const RespondToInvite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inviteId } = useParams();
  const { 
    timeSlots, 
    setSelectedTimeSlot, 
    addParticipant, 
    addTimeSlot, 
    clearTimeSlots,
    loadMeetingFromStorage,
    storeMeetingInStorage
  } = useMeeting();
  
  const [isLoading, setIsLoading] = useState(true);
  const [inviteError, setInviteError] = useState<'invalid' | 'expired' | null>(null);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Friend");
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
      if (!inviteId) {
        setInviteError('invalid');
        setIsLoading(false);
        return;
      }
      
      // Handle demo routes with consistent test data
      if (inviteId.toLowerCase() === "demo_invite") {
        setCreatorName("Abby");
        setResponderName("Friend");
        DEMO_TIME_SLOTS.forEach(slot => {
          addTimeSlot(slot);
        });
        setIsLoading(false);
        return;
      } 
      
      if (inviteId.toLowerCase() === "burt_demo") {
        setCreatorName("Abby");
        setResponderName("Burt");
        DEMO_TIME_SLOTS.forEach(slot => {
          addTimeSlot(slot);
        });
        setIsLoading(false);
        return;
      }
      
      // Try to load meeting data from localStorage using inviteId for real invites
      const loadedMeeting = loadMeetingFromStorage(inviteId);
      
      if (loadedMeeting && loadedMeeting.timeSlots && loadedMeeting.timeSlots.length > 0) {
        // Use data from localStorage
        console.log("Loaded meeting data from storage:", loadedMeeting);
        
        if (loadedMeeting.creator && loadedMeeting.creator.name) {
          setCreatorName(loadedMeeting.creator.name);
        }
        
        // Extract time slots
        loadedMeeting.timeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        setIsLoading(false);
      } else {
        // For any other invite ID that wasn't found in localStorage
        setInviteError('invalid');
        setIsLoading(false);
      }
      
      console.log("Time slots loaded:", timeSlots);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [inviteId, clearTimeSlots, addTimeSlot, loadMeetingFromStorage]);

  useEffect(() => {
    // Debug logging to track when timeSlots changes
    console.log("timeSlots updated:", timeSlots);
  }, [timeSlots]);

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

  if (isLoading) {
    return <InvalidInvitation reason="loading" />;
  }

  if (inviteError) {
    return <InvalidInvitation reason={inviteError} />;
  }

  // Make sure we have time slots loaded
  if (!timeSlots || timeSlots.length === 0) {
    console.log("No time slots found for invite:", inviteId);
    return <InvalidInvitation reason="invalid" />;
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
