
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
    isValid: boolean;
  }[]>([]);

  // Initialize with three time slots
  useEffect(() => {
    if (timeSlots.length === 0) {
      setTimeSlots([
        { date: "", startTime: "--", endTime: "--", isValid: true },
        { date: "", startTime: "--", endTime: "--", isValid: true },
        { date: "", startTime: "--", endTime: "--", isValid: true }
      ]);
    }
  }, []);

  const addNewTimeSlot = () => {
    if (timeSlots.length < 3) {
      setTimeSlots([...timeSlots, { date: "", startTime: "--", endTime: "--", isValid: true }]);
    }
  };

  const validateTimeRange = (startTime: string, endTime: string): boolean => {
    if (startTime === "--" || endTime === "--") {
      return true;
    }

    // Parse times
    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i);
      if (!match) return null;

      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3].toLowerCase();

      // Convert to 24-hour format
      if (period === "pm" && hour < 12) hour += 12;
      if (period === "am" && hour === 12) hour = 0;

      return { hour, minute };
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (!start || !end) return true;

    // Compare times
    if (start.hour > end.hour || (start.hour === end.hour && start.minute >= end.minute)) {
      return false;
    }

    return true;
  };

  const updateTimeSlot = (index: number, field: keyof Omit<TimeSlot, "id" | "responses">, value: string) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { 
      ...updatedSlots[index], 
      [field]: value 
    };
    
    // Only validate when both start and end times are set
    if (field === "startTime" || field === "endTime") {
      const startTime = field === "startTime" ? value : updatedSlots[index].startTime;
      const endTime = field === "endTime" ? value : updatedSlots[index].endTime;
      
      if (startTime !== "--" && endTime !== "--") {
        updatedSlots[index].isValid = validateTimeRange(startTime, endTime);
      }
    }
    
    setTimeSlots(updatedSlots);
  };

  const handleSendToFriends = () => {
    // Only add valid time slots
    timeSlots.forEach(slot => {
      if (slot.date && slot.startTime !== "--" && slot.endTime !== "--" && slot.isValid) {
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
      slot.date && slot.startTime !== "--" && slot.endTime !== "--" && slot.isValid
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
          <div 
            key={index} 
            className={`p-4 ${!slot.isValid ? 'border border-red-500 rounded-xl' : ''}`}
          >
            <DateTimePicker
              onDateChange={(date) => updateTimeSlot(index, "date", date)}
              onStartTimeChange={(time) => updateTimeSlot(index, "startTime", time)}
              onEndTimeChange={(time) => updateTimeSlot(index, "endTime", time)}
              startTime={slot.startTime}
              endTime={slot.endTime}
              isValid={slot.isValid}
            />
          </div>
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
          className={`action-button mt-8 ${!hasValidTimeSlots() ? 'bg-purple-300 hover:bg-purple-300' : 'bg-purple-500 hover:bg-purple-600'}`}
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
