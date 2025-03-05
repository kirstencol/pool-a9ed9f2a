
import { TimeSlot } from "@/types";
import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import TimeSelector from "./TimeSelector";

interface TimeSlotCardProps {
  timeSlot: TimeSlot;
  selectedByUser?: boolean;
  showTimeSelector?: boolean;
  onSelectTime?: (startTime: string, endTime: string) => void;
  onCannotMakeIt?: (e?: React.MouseEvent) => void; 
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
  cannotMakeItText,
  creatorAvailable = true,
  creatorName = "Alex",
  className,
  onClick
}: TimeSlotCardProps) => {
  const [startTime, setStartTime] = useState(timeSlot.startTime);
  const [endTime, setEndTime] = useState(timeSlot.endTime);

  useEffect(() => {
    if (selectedByUser && showTimeSelector) {
      setStartTime(timeSlot.startTime);
      setEndTime(timeSlot.endTime);
    }
  }, [selectedByUser, showTimeSelector, timeSlot.startTime, timeSlot.endTime]);

  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return dateString;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day, 12, 0, 0);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Extract day of week for the "can't make it" text
  const getDayOfWeek = (dateString: string) => {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return "this day";
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day, 12, 0, 0);
    
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Set default cannotMakeItText if not provided
  const dayOfWeek = getDayOfWeek(timeSlot.date);
  const defaultCannotMakeItText = `I can't make it on this day`;
  const finalCannotMakeItText = cannotMakeItText || defaultCannotMakeItText;

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
        "rounded-lg p-4 mb-4 transition-all hover:shadow-sm animate-fade-in",
        selectedByUser 
          ? "bg-purple-50 border border-purple-500" 
          : "border border-gray-200 hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      <div className="mb-2">
        <div className="font-medium">{formatDate(timeSlot.date)}</div>
        {creatorAvailable && !selectedByUser && (
          <div className="text-sm text-gray-600">
            {`${creatorName} is free ${timeSlot.startTime} - ${timeSlot.endTime}`}
          </div>
        )}
        {creatorAvailable && selectedByUser && !showTimeSelector && (
          <div className="text-sm text-purple-700 font-medium">
            You and {creatorName} are free {startTime} - {endTime}
          </div>
        )}
      </div>

      {showTimeSelector && selectedByUser && (
        <div className="bg-purple-100 rounded-lg p-4 my-3">
          <div className="text-center mb-3 font-medium">What time works for you?</div>
          <div className="text-center mb-2 text-sm text-gray-600">
            (Select times within {creatorName}'s availability)
          </div>
          <div className="flex justify-center space-x-4 items-center">
            <TimeSelector 
              time={startTime} 
              onTimeChange={handleStartTimeChange}
              minTime={timeSlot.startTime}
              maxTime={timeSlot.endTime}
            />
            <span className="text-gray-500">to</span>
            <TimeSelector 
              time={endTime} 
              onTimeChange={handleEndTimeChange}
              isEndTime={true}
              startTime={startTime}
              minTime={timeSlot.startTime}
              maxTime={timeSlot.endTime}
            />
          </div>
        </div>
      )}

      {/* Only show the "can't make it" button if the slot is selected by the user */}
      {onCannotMakeIt && selectedByUser && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCannotMakeIt(e);
          }}
          className="text-purple-500 text-sm hover:underline mt-2"
        >
          {finalCannotMakeItText}
        </button>
      )}
    </div>
  );
};

export default memo(TimeSlotCard);
