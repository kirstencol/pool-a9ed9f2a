
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";
import DateTimePicker from "@/components/DateTimePicker";
import { TimeSlot } from "@/types";

const ProposeTime = () => {
  const navigate = useNavigate();
  const { currentUser, addTimeSlot, timeSlots: existingTimeSlots, clearTimeSlots } = useMeeting();
  const [timeSlots, setTimeSlots] = useState<{
    date: string;
    startTime: string;
    endTime: string;
    isValid: boolean;
  }[]>([]);

  // Clear existing time slots when component mounts to avoid duplicates
  useEffect(() => {
    console.log("ProposeTime: Existing time slots in context:", existingTimeSlots);
    clearTimeSlots();
    console.log("ProposeTime: Cleared existing time slots");
  }, [clearTimeSlots]);

  // Initialize with empty time slots if none exist
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

    const parseTime = (timeStr: string) => {
      const match = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i);
      if (!match) return null;

      let hour = parseInt(match[1]);
      const minute = parseInt(match[2]);
      const period = match[3].toLowerCase();

      if (period === "pm" && hour < 12) hour += 12;
      if (period === "am" && hour === 12) hour = 0;

      return { hour, minute };
    };

    const start = parseTime(startTime);
    const end = parseTime(endTime);

    if (!start || !end) return true;

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
    
    if (field === "startTime" || field === "endTime") {
      const startTime = field === "startTime" ? value : updatedSlots[index].startTime;
      const endTime = field === "endTime" ? value : updatedSlots[index].endTime;
      
      if (startTime !== "--" && endTime !== "--") {
        updatedSlots[index].isValid = validateTimeRange(startTime, endTime);
      }
    }
    
    setTimeSlots(updatedSlots);
  };

  const clearTimeSlot = (index: number) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { 
      date: "", 
      startTime: "--", 
      endTime: "--", 
      isValid: true 
    };
    setTimeSlots(updatedSlots);
  };

  const handleSendToFriends = async () => {
    console.log("ProposeTime: Adding time slots to context...");
    
    // Filter valid time slots first
    const validSlots = timeSlots.filter(slot => 
      slot.date && slot.startTime !== "--" && slot.endTime !== "--" && slot.isValid
    );
    
    console.log(`ProposeTime: Found ${validSlots.length} valid time slots to add:`, validSlots);
    
    // Add each valid time slot to the context one by one
    for (const slot of validSlots) {
      const newTimeSlot = {
        id: crypto.randomUUID(),
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        responses: [],
      };
      console.log("ProposeTime: Adding time slot:", newTimeSlot);
      await addTimeSlot(newTimeSlot);
    }
    
    console.log(`ProposeTime: Added ${validSlots.length} valid time slots`);
    
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
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <div className="flex items-center mb-6 sm:mb-8">
        <Avatar initial={currentUser.initial} position="first" size="lg" className="mr-4" />
        <h1 className="text-xl sm:text-2xl font-semibold">When are you free?</h1>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {timeSlots.map((slot, index) => (
          <div 
            key={index} 
            className={`p-3 sm:p-4 ${!slot.isValid ? 'border border-red-500 rounded-xl' : ''}`}
          >
            <DateTimePicker
              onDateChange={(date) => updateTimeSlot(index, "date", date)}
              onStartTimeChange={(time) => updateTimeSlot(index, "startTime", time)}
              onEndTimeChange={(time) => updateTimeSlot(index, "endTime", time)}
              startTime={slot.startTime}
              endTime={slot.endTime}
              isValid={slot.isValid}
              onClear={() => clearTimeSlot(index)}
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
          className={`action-button mt-6 sm:mt-8 ${!hasValidTimeSlots() ? 'bg-purple-300 hover:bg-purple-300 cursor-not-allowed' : 'bg-purple hover:bg-purple/90'}`}
          disabled={!hasValidTimeSlots()}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProposeTime;
