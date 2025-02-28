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
  const { timeSlots, setSelectedTimeSlot, addParticipant, addTimeSlot, clearTimeSlots } = useMeeting();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [creatorName, setCreatorName] = useState("Abby");
  const [responderName, setResponderName] = useState("Burt");

  // Simulating fetching meeting data based on inviteId
  useEffect(() => {
    console.log("Loading invite data for ID:", inviteId);
    
    // Reset time slots
    clearTimeSlots();
    
    // In a real app, you would fetch the data from an API using the inviteId
    // For now, we'll simulate by delaying a bit and using the demo data
    const timer = setTimeout(() => {
      // Set loading to false after some delay to simulate data fetching
      setIsLoading(false);
      
      // Check if we're using the special "burt_demo" ID that indicates we should load Abby's data
      // and show Burt's response view
      if (inviteId === "burt_demo") {
        setCreatorName("Abby");
        setResponderName("Burt");
        
        // Load Abby's time slots
        const abbyTimeSlots = [
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
        
        // Add each time slot to the context
        abbyTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        console.log("Added Abby's time slots for Burt to respond to:", abbyTimeSlots);
      } 
      // For any other inviteId, load demo data so it actually works when clicking copied links
      else {
        console.log("Using default/demo data for invite ID:", inviteId);
        
        // Add demo time slots
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
        
        // Add each demo time slot to the context
        demoTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        console.log("Added demo time slots:", demoTimeSlots);
      }
    }, 1000); // Reduced delay time for better user experience
    
    return () => clearTimeout(timer);
  }, [inviteId, clearTimeSlots, addTimeSlot]);

  const handleSelectTimeSlot = (id: string) => {
    setSelectedSlotId(id);
    const selectedSlot = timeSlots.find(slot => slot.id === id);
    if (selectedSlot) {
      // For Burt-specific data, preset his available times
      if (responderName === "Burt") {
        const slotDate = selectedSlot.date;
        if (slotDate === "March 1") {
          setSelectedStartTime("8:00 AM");
          setSelectedEndTime("1:30 PM");
        } else if (slotDate === "March 2") {
          setSelectedStartTime("9:00 AM");
          setSelectedEndTime("10:00 AM");
        } else {
          // Burt not available on March 3rd
          setSelectedStartTime("");
          setSelectedEndTime("");
        }
      } else {
        setSelectedStartTime(selectedSlot.startTime);
        setSelectedEndTime(selectedSlot.endTime);
      }
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
    // If Burt can't make it on March 3rd (as per requirements)
    if (responderName === "Burt" && selectedSlotId === "3") {
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
