
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";
import { useToast } from "@/hooks/use-toast";

const RespondToInvite = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { inviteId } = useParams();
  const { timeSlots, setSelectedTimeSlot, addParticipant } = useMeeting();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Simulating fetching meeting data based on inviteId
  useEffect(() => {
    console.log("Loading invite data for ID:", inviteId);
    
    // In a real app, you would fetch the data from an API using the inviteId
    // For now, we'll simulate by delaying a bit and using the data from context
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // If there are no time slots in the context yet (cold start from link),
      // we would normally fetch and populate them here
      if (timeSlots.length === 0) {
        // Demo data for testing when accessed directly via URL
        console.log("No time slots found, adding demo data");
        // In a real app, this would come from your backend
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [inviteId, timeSlots]);

  // Simulating a user responding to an invite
  const creatorName = "Alex";
  const responderName = "Jamie";

  const handleSelectTimeSlot = (id: string) => {
    setSelectedSlotId(id);
    const selectedSlot = timeSlots.find(slot => slot.id === id);
    if (selectedSlot) {
      setSelectedStartTime(selectedSlot.startTime);
      setSelectedEndTime(selectedSlot.endTime);
    }
  };

  const handleTimeRangeSelect = (start: string, end: string) => {
    setSelectedStartTime(start);
    setSelectedEndTime(end);
  };

  const handleSubmit = () => {
    if (selectedSlotId) {
      const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
      if (selectedSlot) {
        // Add the responder as a participant
        addParticipant(responderName);
        
        // Set the selected time slot
        setSelectedTimeSlot({
          ...selectedSlot,
          startTime: selectedStartTime,
          endTime: selectedEndTime
        });
        
        // Show success toast
        toast({
          title: "Time confirmed!",
          description: "You're all set for the meetup.",
        });
        
        navigate("/select-location");
      }
    }
  };

  const handleCantMakeIt = () => {
    toast({
      title: "That's okay!",
      description: "We'll let them know you can't make these times.",
      variant: "destructive"
    });
    // In a real app, you might navigate to a page where they can suggest alternative times
    navigate("/");
  };

  // If we're still loading data, show a loading state
  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
        <p className="text-center">Loading invitation details...</p>
      </div>
    );
  }

  if (!timeSlots.length) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">This invitation link appears to be invalid or has expired.</p>
          <button 
            onClick={() => navigate("/")} 
            className="action-button"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <Avatar initial={creatorName.charAt(0)} position="first" size="lg" className="mr-4" />
        <div>
          <h1 className="text-2xl font-semibold">You're invited!</h1>
          <p className="text-gray-600">{creatorName} wants to meet up.</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Avatar initial={responderName.charAt(0)} position="second" className="mr-2" />
          <h2 className="font-medium">When are you free, {responderName}?</h2>
        </div>

        <div className="space-y-4">
          {timeSlots.map((timeSlot) => (
            <TimeSlotCard 
              key={timeSlot.id} 
              timeSlot={timeSlot}
              selectedByUser={selectedSlotId === timeSlot.id}
              showTimeSelector={selectedSlotId === timeSlot.id}
              onSelectTime={handleTimeRangeSelect}
              onCannotMakeIt={handleCantMakeIt}
              creatorAvailable
              creatorName={creatorName}
              onClick={() => handleSelectTimeSlot(timeSlot.id)}
            />
          ))}
        </div>
      </div>

      {selectedSlotId && (
        <button 
          onClick={handleSubmit} 
          className="action-button"
        >
          Confirm time
          <ArrowRight className="ml-2" size={20} />
        </button>
      )}
    </div>
  );
};

export default RespondToInvite;
