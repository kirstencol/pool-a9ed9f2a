
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
  const [hour, setHour] = useState<string>("--");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("am");
  
  // Generate hour options (12, 1, 2, ..., 11)
  const hourOptions = ["--", "12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  // Generate minute options in 15-minute increments (00, 15, 30, 45)
  const minuteOptions = ["00", "15", "30", "45"];
  const periods = ["am", "pm"];

  // Parse the incoming time
  useEffect(() => {
    if (!time || time === "--") {
      setHour("--");
      setMinute("00");
      setPeriod("am");
      return;
    }

    // Parse the time string (e.g., "2:00 pm")
    const match = time.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (match) {
      const parsedHour = match[1];
      const parsedMinute = match[2];
      const parsedPeriod = match[3].toLowerCase();

      setHour(parsedHour);
      setMinute(parsedMinute);
      setPeriod(parsedPeriod);
    }
  }, [time]);

  // When values change, update the parent
  useEffect(() => {
    if (hour === "--") {
      onTimeChange("--");
      return;
    }
    const newTime = `${hour}:${minute} ${period}`;
    onTimeChange(newTime);
  }, [hour, minute, period, onTimeChange]);

  // Handle period change from start time to automatically update end time period
  useEffect(() => {
    if (isEndTime && startTime && startTime !== "--") {
      const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
      if (match) {
        const startPeriod = match[3].toLowerCase();
        // Only auto-update end time period to PM if start time is PM
        if (startPeriod === "pm") {
          setPeriod("pm");
        }
      }
    }
  }, [isEndTime, startTime]);

  // Filter minute options for end time to prevent invalid selections
  const getAvailableMinuteOptions = () => {
    if (!isEndTime || !startTime || startTime === "--" || hour === "--") {
      return minuteOptions;
    }

    const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return minuteOptions;

    const startHour = parseInt(match[1]);
    const startMinute = parseInt(match[2]);
    const startPeriod = match[3].toLowerCase();

    // If end time is PM and start time is AM, all minutes are valid
    if (period === "pm" && startPeriod === "am") {
      return minuteOptions;
    }

    // If same hour and same period, filter minutes
    if (period === startPeriod && hour === match[1]) {
      return minuteOptions.filter(option => parseInt(option) > startMinute);
    }

    // For all other cases, all minute options are valid
    return minuteOptions;
  };

  // Determine if a given hour is valid for selection
  const isHourValid = (hourOption: string) => {
    if (hourOption === "--") return true;
    if (!isEndTime || !startTime || startTime === "--") return true;

    const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return true;

    const startHour = match[1];
    const startPeriod = match[3].toLowerCase();

    // If periods are different
    if (period !== startPeriod) {
      // End time PM, start time AM - all hours valid
      if (period === "pm" && startPeriod === "am") {
        return true;
      }
      // End time AM, start time PM - night crossing, only valid if we're dealing with the next day
      if (period === "am" && startPeriod === "pm") {
        // This would require date comparison which we're not implementing here
        return true;
      }
    }

    // Same period, need to compare hours
    if (period === startPeriod) {
      const hourVal = hourOption === "12" ? 0 : parseInt(hourOption);
      const startHourVal = startHour === "12" ? 0 : parseInt(startHour);
      
      // If hours are different, must be later
      return hourVal > startHourVal;
    }

    return true;
  };

  return (
    <div className="time-selector-container flex space-x-1">
      {/* Hour selector */}
      <Select 
        value={hour} 
        onValueChange={(value) => setHour(value)}
      >
        <SelectTrigger className="w-16 border border-gray-300">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((h) => (
            <SelectItem 
              key={h} 
              value={h} 
              className="border-b border-gray-200"
              disabled={isEndTime && !isHourValid(h)}
            >
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Minute selector (only enabled if hour is selected) */}
      <Select 
        value={minute} 
        onValueChange={(value) => setMinute(value)}
        disabled={hour === "--"}
      >
        <SelectTrigger className="w-16 border border-gray-300">
          <SelectValue placeholder="00" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableMinuteOptions().map((m) => (
            <SelectItem key={m} value={m} className="border-b border-gray-200">
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AM/PM selector (only enabled if hour is selected) */}
      <Select 
        value={period} 
        onValueChange={(value) => setPeriod(value)}
        disabled={hour === "--"}
      >
        <SelectTrigger className="w-16 border border-gray-300">
          <SelectValue placeholder={period} />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p} value={p} className="border-b border-gray-200">
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelector;
