
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
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

  // Initialize with one time slot
  useEffect(() => {
    if (timeSlots.length === 0) {
      setTimeSlots([
        { date: "", startTime: "10:00 am", endTime: "10:00 pm" },
        { date: "", startTime: "10:00 am", endTime: "10:00 pm" },
        { date: "", startTime: "10:00 am", endTime: "10:00 pm" }
      ]);
    }
  }, []);

  const addNewTimeSlot = () => {
    if (timeSlots.length < 3) {
      setTimeSlots([...timeSlots, { date: "", startTime: "10:00 am", endTime: "10:00 pm" }]);
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

  const hasValidTimeSlots = () => {
    return timeSlots.some(slot => 
      slot.date && slot.startTime && slot.endTime
    );
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
            className="action-button bg-white text-purple-500 border-2 border-purple-500 hover:bg-purple-50 flex items-center justify-center"
          >
            <Plus size={18} className="mr-2" />
            Add another time option
          </button>
        )}

        <button
          onClick={handleSendToFriends}
          className="action-button mt-8"
          disabled={!hasValidTimeSlots()}
        >
          Send to friends
          <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProposeTime;
