
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useToast } from "@/hooks/use-toast";
import { convertTimeToMinutes } from "@/utils/timeUtils";

interface TimeSlot {
  id: string;
  date: string;
  overlapStartTime: string;
  overlapEndTime: string;
}

interface TimeSelectionProps {
  timeSlots: TimeSlot[];
  onContinue: (selectedSlot: TimeSlot, duration: number) => void;
}

const TimeSelection: React.FC<TimeSelectionProps> = ({ timeSlots, onContinue }) => {
  const { toast } = useToast();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("60");

  const handleTimeSlotSelection = (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId);
  };

  const handleContinue = () => {
    if (!selectedTimeSlot) {
      toast({
        title: "No time selected",
        description: "Please select a time that works for everyone",
        variant: "destructive"
      });
      return;
    }

    const selectedSlot = timeSlots.find(slot => slot.id === selectedTimeSlot);
    if (selectedSlot) {
      onContinue(selectedSlot, parseInt(selectedDuration));
    }
  };

  const calculateEndTime = (startTime: string, durationMinutes: string) => {
    // Convert start time to minutes since midnight
    const startMinutes = convertTimeToMinutes(startTime);
    
    // Add duration
    const endMinutes = startMinutes + parseInt(durationMinutes);
    
    // Convert back to time format
    return formatMinutesToTime(endMinutes);
  };

  // Format minutes back to time string (e.g., "9:30 AM")
  function formatMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Avatar initial="S" className="mx-auto mb-4" size="lg" />
        <h1 className="text-2xl font-semibold text-center">Good news! Two times work for everyone.</h1>
        <p className="text-center mt-2">Take your pick:</p>
      </div>

      <div className="space-y-4 mb-8">
        {timeSlots.map((timeSlot) => (
          <button
            key={timeSlot.id}
            onClick={() => handleTimeSlotSelection(timeSlot.id)}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              selectedTimeSlot === timeSlot.id 
                ? "bg-purple/10 border-2 border-purple" 
                : "border-2 border-gray-100"
            }`}
          >
            <h3 className="text-xl font-medium mb-1">
              {timeSlot.date}
            </h3>
            <p className="text-lg">
              Everyone's free {timeSlot.overlapStartTime} - {timeSlot.overlapEndTime}
            </p>
          </button>
        ))}
      </div>

      {selectedTimeSlot && (
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            How long do you need?
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>

          {selectedTimeSlot && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                Selected time: {timeSlots.find(ts => ts.id === selectedTimeSlot)?.date}
                <br />
                From: {timeSlots.find(ts => ts.id === selectedTimeSlot)?.overlapStartTime}
                <br />
                To: {calculateEndTime(
                  timeSlots.find(ts => ts.id === selectedTimeSlot)?.overlapStartTime || "",
                  selectedDuration
                )}
              </p>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleContinue}
        className="action-button"
        disabled={!selectedTimeSlot}
      >
        Continue <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default TimeSelection;
