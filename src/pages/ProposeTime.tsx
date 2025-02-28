
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import DateTimePicker from "@/components/DateTimePicker";
import TimeSlotCard from "@/components/TimeSlotCard";
import { TimeSlot } from "@/types";

const ProposeTime = () => {
  const navigate = useNavigate();
  const { currentUser, setTimeSlots } = useMeeting();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const addTimeSlot = (newSlot: TimeSlot) => {
    setSlots((prev) => [...prev, newSlot]);
    setShowDatePicker(false);
  };
  
  const removeTimeSlot = (id: string) => {
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  const handleContinue = () => {
    setTimeSlots(slots);
    navigate("/time-confirmation");
  };

  if (!currentUser) {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center py-6 px-4">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="status-bar">
          <div className="status-bar-time">7:15</div>
          <div className="status-bar-icons">
            <span>●●●</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-6 mt-8 text-center">When are you free?</h1>
        
        {slots.length > 0 && (
          <div className="mb-6">
            <h2 className="font-medium mb-4">Your availability:</h2>
            <div className="space-y-4">
              {slots.map((timeSlot) => (
                <TimeSlotCard 
                  key={timeSlot.id} 
                  timeSlot={timeSlot}
                  onCannotMakeIt={() => removeTimeSlot(timeSlot.id)}
                  cannotMakeItText="Remove"
                  creatorName={currentUser.name}
                />
              ))}
            </div>
          </div>
        )}

        {showDatePicker ? (
          <DateTimePicker onAddTimeSlot={addTimeSlot} onCancel={() => setShowDatePicker(false)} />
        ) : (
          <button
            onClick={() => setShowDatePicker(true)}
            className="border border-gray-300 rounded-md py-3 px-4 flex items-center justify-center w-full mb-6"
          >
            <Plus size={20} className="mr-2" />
            <span>Add a time</span>
          </button>
        )}

        {slots.length > 0 && (
          <button
            onClick={handleContinue}
            className="action-button mt-6"
          >
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProposeTime;
