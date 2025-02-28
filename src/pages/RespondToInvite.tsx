
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";

const RespondToInvite = () => {
  const navigate = useNavigate();
  const { inviteId } = useParams();
  const { timeSlots, setSelectedTimeSlot } = useMeeting();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

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
      const selectedSlot = timeSlots.find(slot => slot.id === id);
      if (selectedSlot) {
        setSelectedTimeSlot({
          ...selectedSlot,
          startTime: selectedStartTime,
          endTime: selectedEndTime
        });
        navigate("/select-location");
      }
    }
  };

  if (!timeSlots.length) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <Avatar initial={creatorName.charAt(0)} size="lg" className="mr-4" />
        <div>
          <h1 className="text-2xl font-semibold">You're invited!</h1>
          <p className="text-gray-600">{creatorName} wants to meet up.</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Avatar initial={responderName.charAt(0)} className="mr-2" />
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
              onCannotMakeIt={() => {}}
              creatorAvailable
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
