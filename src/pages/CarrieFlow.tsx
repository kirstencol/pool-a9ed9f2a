
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useInviteData } from "@/hooks/useInviteData";
import { TimeSlot } from "@/types";
import { Button } from "@/components/ui/button";
import TimeSlotCard from "@/components/TimeSlotCard";
import { useMeeting } from "@/context/meeting";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";

const CarrieFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const inviteId = searchParams.get("id") || "carrie_demo";
  
  const { creatorName, responderName, inviteTimeSlots, isLoading, inviteError } = useInviteData(inviteId, "Carrie");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const { setCurrentUser } = useMeeting();

  // Set Carrie as the current user when component mounts
  useEffect(() => {
    setCurrentUser({
      id: "carrie-id",
      name: "Carrie",
      initial: "C"
    });
    
    // Store that we're in Carrie's flow
    localStorage.setItem('currentUser', 'Carrie');
    console.log("CarrieFlow - Set current user to Carrie");
  }, [setCurrentUser]);

  const handleSelectTimeSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setSelectedStartTime(slot.startTime);
    setSelectedEndTime(slot.endTime);
  };

  const handleTimeChange = (start: string, end: string) => {
    setSelectedStartTime(start);
    setSelectedEndTime(end);
  };

  const handleContinue = () => {
    if (selectedTimeSlot && selectedStartTime && selectedEndTime) {
      // Add a toast to confirm the selection
      toast({
        title: "Time selected!",
        description: "Moving to time confirmation"
      });
      
      console.log("CarrieFlow - Navigating to confirmation with params:", {
        id: inviteId,
        date: selectedTimeSlot.date,
        startTime: selectedStartTime,
        endTime: selectedEndTime
      });
      
      // Navigate directly to CarrieTimeConfirmation
      navigate(`/carrie-time-confirmation?id=${inviteId}&date=${selectedTimeSlot.date}&startTime=${selectedStartTime}&endTime=${selectedEndTime}`);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (inviteError) {
    return <div className="p-6">Error: Invalid or expired invitation</div>;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <div className="flex items-center mb-6">
        <Avatar initial="C" position="third" className="mr-3" />
        <h2 className="font-medium text-lg">When are you free, Carrie?</h2>
      </div>

      <div className="mb-6">
        <div className="space-y-3">
          {inviteTimeSlots.map((slot) => (
            <TimeSlotCard
              key={slot.id}
              timeSlot={{
                ...slot,
                // Override the creator display name explicitly
                creatorDisplayName: "Abby and Burt"
              }}
              selectedByUser={selectedTimeSlot?.id === slot.id}
              showTimeSelector={selectedTimeSlot?.id === slot.id}
              onSelectTime={handleTimeChange}
              creatorAvailable={true}
              // Set this explicitly to ensure it's used if creatorDisplayName is not processed
              creatorName="Abby and Burt"
              onClick={() => handleSelectTimeSlot(slot)}
            />
          ))}
        </div>
      </div>

      {selectedTimeSlot && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleContinue}
            size="icon"
            className="rounded-full h-10 w-10"
          >
            <ArrowRight size={18} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default CarrieFlow;
