
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
}

const DateTimePicker = ({ 
  onDateChange, 
  onStartTimeChange, 
  onEndTimeChange 
}: DateTimePickerProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("10:00 am");
  const [endTime, setEndTime] = useState("10:00 pm");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onDateChange(formattedDate);
      setIsCalendarOpen(false);
    }
  };

  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    onStartTimeChange(newTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    setEndTime(newTime);
    onEndTimeChange(newTime);
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="mb-4">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <button className="w-full border-b border-gray-300 focus:border-purple-500 focus:outline-none py-2 flex items-center">
              <Calendar className="mr-2 text-gray-500" size={20} />
              <span className="text-gray-700">
                {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date"}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center">
        <Clock className="mr-2 text-gray-500" size={20} />
        <div className="flex items-center justify-between w-full">
          <TimeSelector 
            time={startTime} 
            onTimeChange={handleStartTimeChange}
          />
          <span className="text-gray-500 px-4">to</span>
          <TimeSelector 
            time={endTime} 
            onTimeChange={handleEndTimeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
