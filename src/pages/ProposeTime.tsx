
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";
import DateTimePicker from "@/components/DateTimePicker";
import { TimeSlot } from "@/types";
import { Button } from "@/components/ui/button";

const ProposeTime = () => {
  const navigate = useNavigate();
  const { currentUser, addTimeSlot, timeSlots: existingTimeSlots } = useMeeting();
  const [timeSlots, setTimeSlots] = useState<{
    date: string;
    startTime: string;
    endTime: string;
    isValid: boolean;
  }[]>([]);

  useEffect(() => {
    console.log("Existing time slots in context:", existingTimeSlots);
  }, [existingTimeSlots]);

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

  const handleSendToFriends = () => {
    console.log("Adding time slots to context...");
    
    let validSlotsAdded = 0;
    timeSlots.forEach(slot => {
      if (slot.date && slot.startTime !== "--" && slot.endTime !== "--" && slot.isValid) {
        addTimeSlot({
          id: crypto.randomUUID(),
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          responses: [],
        });
        validSlotsAdded++;
      }
    });
    
    console.log(`Added ${validSlotsAdded} valid time slots`);
    
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
            className={`bg-white rounded-lg border ${!slot.isValid ? 'border-red-500' : 'border-gray-200'} p-4 shadow-sm transition-all hover:shadow-md`}
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
            {!slot.isValid && (
              <p className="text-red-500 text-sm mt-2">End time must be after start time</p>
            )}
          </div>
        ))}

        {timeSlots.length < 3 && (
          <Button
            onClick={addNewTimeSlot}
            variant="outline"
            className="w-full border-2 border-purple hover:bg-purple-50 text-purple-700 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add another time option
          </Button>
        )}

        <Button
          onClick={handleSendToFriends}
          className="w-full bg-purple hover:bg-purple/90 text-white flex items-center justify-center"
          disabled={!hasValidTimeSlots()}
        >
          <ArrowRight size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ProposeTime;
