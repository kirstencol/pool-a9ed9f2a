
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
}

const TimeSelector = ({ 
  time, 
  onTimeChange, 
  isEndTime = false, 
  startTime = "" 
}: TimeSelectorProps) => {
  const [timeValue, setTimeValue] = useState<string>("--");
  const [period, setPeriod] = useState<string>("am");
  
  // Generate time options in 15-minute increments (1:00, 1:15, 1:30, 1:45, etc.)
  const timeOptions = [
    "--",
    "12:00", "12:15", "12:30", "12:45",
    "1:00", "1:15", "1:30", "1:45",
    "2:00", "2:15", "2:30", "2:45",
    "3:00", "3:15", "3:30", "3:45",
    "4:00", "4:15", "4:30", "4:45",
    "5:00", "5:15", "5:30", "5:45",
    "6:00", "6:15", "6:30", "6:45",
    "7:00", "7:15", "7:30", "7:45",
    "8:00", "8:15", "8:30", "8:45",
    "9:00", "9:15", "9:30", "9:45",
    "10:00", "10:15", "10:30", "10:45",
    "11:00", "11:15", "11:30", "11:45",
  ];
  
  const periods = ["am", "pm"];

  // Parse the incoming time
  useEffect(() => {
    if (!time || time === "--") {
      setTimeValue("--");
      setPeriod("am");
      return;
    }

    // Parse the time string (e.g., "2:00 pm")
    const match = time.match(/(\d+:\d+)\s?(am|pm)/i);
    if (match) {
      const parsedTime = match[1];
      const parsedPeriod = match[2].toLowerCase();

      setTimeValue(parsedTime);
      setPeriod(parsedPeriod);
    }
  }, [time]);

  // When time values change, update the parent
  useEffect(() => {
    if (timeValue === "--") {
      onTimeChange("--");
      return;
    }
    const newTime = `${timeValue} ${period}`;
    onTimeChange(newTime);
  }, [timeValue, period, onTimeChange]);

  // Filter time options for end time to prevent invalid selections
  const getAvailableTimeOptions = () => {
    if (!isEndTime || !startTime || startTime === "--") {
      return timeOptions;
    }

    const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return timeOptions;

    const startTimeHour = parseInt(match[1]);
    const startTimeMinute = parseInt(match[2]);
    const startTimePeriod = match[3].toLowerCase();

    // If end time period is different from start time period
    if (period !== startTimePeriod) {
      // If end time is PM and start time is AM, all options are valid
      if (period === "pm" && startTimePeriod === "am") {
        return timeOptions;
      }
      // If end time is AM and start time is PM, no valid options (night crossing)
      if (period === "am" && startTimePeriod === "pm") {
        return ["--"]; // Only allow the placeholder
      }
    }

    // Same period (both AM or both PM)
    return timeOptions.filter(option => {
      if (option === "--") return true;
      
      const [hourStr, minuteStr] = option.split(":");
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr);
      
      if (hour < startTimeHour) return false;
      if (hour === startTimeHour && minute <= startTimeMinute) return false;
      
      return true;
    });
  };

  return (
    <div className="time-selector-container flex space-x-1">
      <Select 
        value={timeValue} 
        onValueChange={(value) => setTimeValue(value)}
      >
        <SelectTrigger className="w-24">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableTimeOptions().map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={period} onValueChange={(value) => setPeriod(value)}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder={period} />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
