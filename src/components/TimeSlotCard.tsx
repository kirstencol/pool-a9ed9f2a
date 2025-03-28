
import { TimeSlot } from "@/types";
import { useState, useEffect, memo } from "react";
import { cn } from "@/lib/utils";
import TimeSelector from "./TimeSelector";
import { X } from "lucide-react";

interface TimeSlotCardProps {
  timeSlot: TimeSlot & { creatorDisplayName?: string };
  selectedByUser?: boolean;
  showTimeSelector?: boolean;
  onSelectTime?: (startTime: string, endTime: string) => void;
  onCannotMakeIt?: (e?: React.MouseEvent) => void; 
  cannotMakeItText?: string;
  creatorAvailable?: boolean;
  creatorName?: string;
  className?: string;
  onClick?: () => void;
  customTimeSelectorText?: string;
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
  onClick,
  customTimeSelectorText
}: TimeSlotCardProps) => {
  const [startTime, setStartTime] = useState(timeSlot.startTime);
  const [endTime, setEndTime] = useState(timeSlot.endTime);

  // Use either the custom display name from the timeSlot or the provided creatorName
  const displayCreatorName = timeSlot.creatorDisplayName || creatorName;
  
  // Determine verb form based on whether the name includes "and"
  const verbForm = displayCreatorName.includes(" and ") ? "are" : "is";

  // Debug logs to help diagnose the issue
  console.log("TimeSlotCard - Display Creator Name:", displayCreatorName);
  console.log("TimeSlotCard - Verb Form:", verbForm);
  console.log("TimeSlotCard - CreatorDisplayName from timeSlot:", timeSlot.creatorDisplayName);
  console.log("TimeSlotCard - CreatorName prop:", creatorName);

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

  const getDayOfWeek = (dateString: string) => {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return "this day";
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day, 12, 0, 0);
    
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

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
        "rounded-lg p-4 mb-4 transition-all hover:shadow-sm animate-fade-in relative",
        selectedByUser 
          ? "bg-purple-50 border border-purple-500" 
          : "border border-gray-200 hover:border-gray-300",
        className
      )}
      onClick={onClick}
    >
      {selectedByUser && onCannotMakeIt && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onCannotMakeIt(e);
          }}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
          aria-label="Remove time slot"
        >
          <X size={16} />
        </button>
      )}

      <div className="mb-2">
        <div className="font-medium">{formatDate(timeSlot.date)}</div>
        {creatorAvailable && (
          <div className={cn(
            "text-sm",
            selectedByUser && !showTimeSelector ? "text-purple-700" : "text-gray-600"
          )}>
            {selectedByUser && !showTimeSelector ? 
              `You and ${displayCreatorName} are free ${startTime} - ${endTime}` :
              `${displayCreatorName} ${verbForm} free ${timeSlot.startTime} - ${timeSlot.endTime}`}
          </div>
        )}
      </div>

      {showTimeSelector && selectedByUser && (
        <div className="bg-purple-100 rounded-lg p-4 my-3">
          <div className="text-center mb-3 font-medium">
            {customTimeSelectorText || "What time works for you?"}
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
    </div>
  );
};

export default memo(TimeSlotCard);
