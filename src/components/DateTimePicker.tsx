
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import TimeSelector from "./TimeSelector";

interface DateTimePickerProps {
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  startTime?: string;
  endTime?: string;
  isValid?: boolean;
  onClear?: () => void;
}

const DateTimePicker = ({ 
  onDateChange, 
  onStartTimeChange, 
  onEndTimeChange,
  startTime = "--",
  endTime = "--",
  isValid = true,
  onClear
}: DateTimePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      
      // Fix for timezone issue - preserve the selected date exactly as shown in the calendar
      // Use YYYY-MM-DD format and add a time of noon to avoid timezone issues
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      onDateChange(formattedDate);
      setIsCalendarOpen(false);
    }
  };

  const handleStartTimeChange = (newTime: string) => {
    onStartTimeChange(newTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    onEndTimeChange(newTime);
  };

  const handleClear = () => {
    setDate(undefined);
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="animate-fade-in">
      <div>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="w-full border-b border-gray-300 focus:border-purple-500 focus:outline-none py-2 flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gray-500" size={20} />
                <span className="text-gray-700">
                  {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
                </span>
              </div>
              {date && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className={`flex items-center ${!isValid ? 'text-red-500' : 'text-gray-700'} mt-3`}>
        <Clock className="mr-2" size={20} />
        <div className="flex items-center justify-between w-full">
          <TimeSelector 
            time={startTime} 
            onTimeChange={handleStartTimeChange}
          />
          <span className="px-4">to</span>
          <TimeSelector 
            time={endTime} 
            onTimeChange={handleEndTimeChange}
            isEndTime={true}
            startTime={startTime}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
