
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import DateTimePicker from "@/components/DateTimePicker";
import { TimeSlot } from "@/types";

const ProposeTime = () => {
  const navigate = useNavigate();
  const { currentUser, addTimeSlot } = useMeeting();
  const [timeSlots, setTimeSlots] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  }[]>([]);

  const addNewTimeSlot = () => {
    if (timeSlots.length < 3) {
      setTimeSlots([...timeSlots, { date: "", startTime: "", endTime: "" }]);
    }
  };

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setTimeSlots(updatedSlots);
  };

  const handleSendToFriends = () => {
    // Validate and add time slots
    timeSlots.forEach(slot => {
      if (slot.date && slot.startTime && slot.endTime) {
        addTimeSlot({
          id: crypto.randomUUID(),
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          responses: [],
        });
      }
    });
    
    navigate("/time-confirmation");
  };

  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <Avatar initial={currentUser.initial} size="lg" className="mr-4" />
        <h1 className="text-2xl font-semibold">When are you free?</h1>
      </div>

      <div className="space-y-8">
        {timeSlots.map((slot, index) => (
          <DateTimePicker
            key={index}
            onDateChange={(date) => updateTimeSlot(index, "date", date)}
            onStartTimeChange={(time) => updateTimeSlot(index, "startTime", time)}
            onEndTimeChange={(time) => updateTimeSlot(index, "endTime", time)}
          />
        ))}

        {timeSlots.length < 3 && (
          <button
            onClick={addNewTimeSlot}
            className="action-button bg-white text-purple-DEFAULT border-2 border-purple-DEFAULT hover:bg-purple-light"
          >
            Add another time
          </button>
        )}

        {timeSlots.length > 0 && (
          <button
            onClick={handleSendToFriends}
            className="action-button mt-8"
            disabled={!timeSlots.some(slot => 
              slot.date && slot.startTime && slot.endTime
            )}
          >
            Send to friends
            <ArrowRight className="ml-2" size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposeTime;
