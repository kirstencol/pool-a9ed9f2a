
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";
import { TimeSlot } from "@/types";

interface InviteResponseFormProps {
  creatorName: string;
  responderName: string;
  timeSlots: TimeSlot[];
}

const InviteResponseForm: React.FC<InviteResponseFormProps> = ({
  creatorName,
  responderName,
  timeSlots
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setSelectedTimeSlot, addParticipant } = useMeeting();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

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

export default InviteResponseForm;
