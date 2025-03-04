
import { TimeSlot } from "@/types";
import { useState, useEffect, memo } from "react";
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
  creatorName?: string;
  className?: string;
  onClick?: () => void;
}

const TimeSlotCard = ({
  timeSlot,
  selectedByUser = false,
  showTimeSelector = false,
  onSelectTime,
  onCannotMakeIt,
  cannotMakeItText = "I can't make it",
  creatorAvailable = true,
  creatorName = "Alex",
  className,
  onClick
}: TimeSlotCardProps) => {
  const [startTime, setStartTime] = useState(timeSlot.startTime);
  const [endTime, setEndTime] = useState(timeSlot.endTime);

  // Set initial times when the card becomes selected
  useEffect(() => {
    if (selectedByUser && showTimeSelector) {
      setStartTime(timeSlot.startTime);
      setEndTime(timeSlot.endTime);
    }
  }, [selectedByUser, showTimeSelector, timeSlot.startTime, timeSlot.endTime]);

  // Format date for display (e.g., "Friday, October 25")
  const formatDate = (dateString: string) => {
    // Ensure we're not affected by timezone when displaying the date
    // Add a time component (noon) to avoid timezone shifts
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return dateString;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day, 12, 0, 0);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
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
    <div 
      className={cn(
        "time-slot-card",
        selectedByUser && "selected",
        className
      )}
      onClick={onClick}
    >
      <div className="mb-2">
        <div className="font-medium">{formatDate(timeSlot.date)}</div>
        {creatorAvailable && (
          <div className="text-sm text-gray-600">
            {`${creatorName} is free ${timeSlot.startTime} - ${timeSlot.endTime}`}
          </div>
        )}
      </div>

      {showTimeSelector && selectedByUser && (
        <div className="bg-purple-100 rounded-lg p-4 my-3">
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
              isEndTime={true}
              startTime={startTime}
            />
          </div>
        </div>
      )}

      {onCannotMakeIt && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCannotMakeIt();
          }}
          className="text-purple-500 text-sm hover:underline mt-2"
        >
          {cannotMakeItText}
        </button>
      )}
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(TimeSlotCard);
