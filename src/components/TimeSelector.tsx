
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

  // Handle period change from start time to automatically update end time
  useEffect(() => {
    if (isEndTime && startTime && startTime !== "--") {
      const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
      if (match) {
        const startPeriod = match[3].toLowerCase();
        // Auto-update end time period to match start time period
        setPeriod(startPeriod);
      }
    }
  }, [isEndTime, startTime]);

  // Filter hour options for end time to prevent invalid selections
  const getAvailableHourOptions = () => {
    if (!isEndTime || !startTime || startTime === "--") {
      return hourOptions;
    }

    const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return hourOptions;

    const startHour = parseInt(match[1]);
    const startMinute = parseInt(match[2]);
    const startPeriod = match[3].toLowerCase();

    // If end time period is different from start time period
    if (period !== startPeriod) {
      // If end time is PM and start time is AM, all options are valid
      if (period === "pm" && startPeriod === "am") {
        return hourOptions;
      }
      // If end time is AM and start time is PM, no valid options (night crossing)
      if (period === "am" && startPeriod === "pm") {
        return ["--"]; // Only allow the placeholder
      }
    }

    // Same period (both AM or both PM)
    if (period === startPeriod) {
      return hourOptions.filter(option => {
        if (option === "--") return true;
        
        const hourVal = option === "12" ? 0 : parseInt(option);
        const startHourVal = startHour === 12 ? 0 : startHour;
        
        return hourVal > startHourVal || (hourVal === startHourVal && getAvailableMinuteOptions().includes(minute));
      });
    }

    return hourOptions;
  };

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

    // If periods are different, all minute options are valid
    if (period !== startPeriod) {
      return minuteOptions;
    }

    // If same hour in same period, filter minutes
    const hourVal = hour === "12" ? 0 : parseInt(hour);
    const startHourVal = startHour === 12 ? 0 : startHour;

    if (hourVal === startHourVal) {
      return minuteOptions.filter(option => {
        return parseInt(option) > startMinute;
      });
    }

    // If different hours in same period, all minute options are valid
    return minuteOptions;
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
          {getAvailableHourOptions().map((h) => (
            <SelectItem key={h} value={h} className="border-b border-gray-200">
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
