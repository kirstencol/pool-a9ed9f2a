
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TimeSelector from "./TimeSelector";

interface DateTimePickerProps {
  date?: string;
  startTime?: string;
  endTime?: string;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const DateTimePicker = ({
  date,
  startTime = "9:00 am",
  endTime = "10:00 am",
  onDateChange,
  onStartTimeChange,
  onEndTimeChange
}: DateTimePickerProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate.toISOString());
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className="border border-border rounded-xl p-5 bg-white">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(new Date(date), "EEEE, MMMM d, yyyy") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={handleSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Time Range
        </label>
        <div className="flex items-center space-x-4">
          <TimeSelector 
            time={startTime} 
            onTimeChange={onStartTimeChange} 
          />
          <span className="text-gray-400">to</span>
          <TimeSelector 
            time={endTime} 
            onTimeChange={onEndTimeChange} 
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
