
import { TimeSlot } from "@/types";
import { useState } from "react";
import { cn } from "@/lib/utils";
import TimeSelector from "./TimeSelector";

interface TimeSlotCardProps {
  timeSlot: TimeSlot;
  selectedByUser?: boolean;
  showTimeSelector?: boolean;
  onSelectTime?: (startTime: string, endTime: string) => void;
  onCannotMakeIt?: () => void;
  cannotMakeItText?: string;
  creatorAvailable?: boolean;
  className?: string;
}

const TimeSlotCard = ({
  timeSlot,
  selectedByUser = false,
  showTimeSelector = false,
  onSelectTime,
  onCannotMakeIt,
  cannotMakeItText = "I can't make it",
  creatorAvailable = true,
  className
}: TimeSlotCardProps) => {
  const [startTime, setStartTime] = useState(timeSlot.startTime);
  const [endTime, setEndTime] = useState(timeSlot.endTime);

  // Format date for display (e.g., "Friday, October 25")
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    if (onSelectTime) onSelectTime(newTime, endTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    setEndTime(newTime);
    if (onSelectTime) onSelectTime(startTime, newTime);
  };

  return (
    <div className={cn(
      "time-slot-card",
      selectedByUser && "selected",
      className
    )}>
      <div className="mb-2">
        <div className="font-medium">{formatDate(timeSlot.date)}</div>
        {creatorAvailable && (
          <div className="text-sm text-gray-600">
            {`Alex is free ${timeSlot.startTime} - ${timeSlot.endTime}`}
          </div>
        )}
      </div>

      {showTimeSelector && selectedByUser && (
        <div className="bg-purple-light rounded-lg p-4 my-3">
          <div className="text-center mb-3 font-medium">What time works for you?</div>
          <div className="flex justify-center space-x-4 items-center">
            <TimeSelector 
              time={startTime} 
              onTimeChange={handleStartTimeChange} 
            />
            <span className="text-gray-500">to</span>
            <TimeSelector 
              time={endTime} 
              onTimeChange={handleEndTimeChange} 
            />
          </div>
        </div>
      )}

      {onCannotMakeIt && (
        <button 
          onClick={onCannotMakeIt}
          className="text-purple-dark text-sm hover:underline mt-2"
        >
          {cannotMakeItText}
        </button>
      )}
    </div>
  );
};

export default TimeSlotCard;
