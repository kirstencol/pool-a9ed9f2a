
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import { TimeSlot } from "@/types";
import TimeSlotSelection from "./TimeSlotSelection";
import Loading from "@/components/Loading"; // Import our new Loading component

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
    timeSlots,
    setSelectedTimeSlot, 
    addParticipant,
    loadMeetingFromStorage,
    storeMeetingInStorage
  } = useMeeting();
  
  const [localTimeSlots, setLocalTimeSlots] = useState<TimeSlot[]>([]);
  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Get timeSlots from context to ensure we're using the most up-to-date data
  useEffect(() => {
    setIsLoading(true);
    console.log("ResponseForm - Using timeSlots from context:", timeSlots);
    
    if (timeSlots && timeSlots.length > 0) {
      setLocalTimeSlots(timeSlots);
      setIsLoading(false);
    } else if (inviteId) {
      // Fallback: try to get time slots directly from storage
      console.log("ResponseForm - Trying to load time slots directly from storage for:", inviteId);
      const storedMeeting = loadMeetingFromStorage(inviteId);
      if (storedMeeting?.timeSlots && storedMeeting.timeSlots.length > 0) {
        console.log("ResponseForm - Loaded time slots from storage:", storedMeeting.timeSlots);
        setLocalTimeSlots(storedMeeting.timeSlots);
        
        // Add to context if not already there
        storedMeeting.timeSlots.forEach(slot => {
          // Only add if not already in context
          if (!timeSlots.some(ts => ts.id === slot.id)) {
            addTimeSlot(slot);
          }
        });
        
        setIsLoading(false);
      } else {
        console.error("ResponseForm - Failed to load time slots from storage");
        setTimeout(() => setIsLoading(false), 1000); // Safety timeout
      }
    }
  }, [timeSlots, inviteId, loadMeetingFromStorage, addTimeSlot]);

  // Log when the component renders with timeSlots
  console.log("ResponseForm rendering with localTimeSlots:", localTimeSlots);

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
    return <Loading message="Preparing time slots..." subtitle="Just a moment while we get your options ready" />;
  }

  if (!localTimeSlots || localTimeSlots.length === 0) {
    return (
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium text-red-600 mb-2">No time slots available</h3>
        <p className="text-gray-600 mb-4">There are no time slots available for this invitation.</p>
        <button 
          onClick={() => navigate('/')}
          className="text-purple-500 hover:underline font-medium"
        >
          Return to home
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <TimeSlotSelection
        timeSlots={localTimeSlots}
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
