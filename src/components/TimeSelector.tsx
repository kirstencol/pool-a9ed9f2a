
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
  const [period, setPeriod] = useState<string>("");
  
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
      setPeriod("");
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
    if (hour === "--" || period === "") {
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

  return (
    <div className="time-selector-container flex space-x-1">
      {/* Hour selector */}
      <Select 
        value={hour} 
        onValueChange={(value) => setHour(value)}
      >
        <SelectTrigger className="w-16">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {hourOptions.map((h) => (
            <SelectItem 
              key={h} 
              value={h}
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
        <SelectTrigger className="w-16">
          <SelectValue placeholder="00" />
        </SelectTrigger>
        <SelectContent>
          {minuteOptions.map((m) => (
            <SelectItem key={m} value={m}>
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
        <SelectTrigger className="w-16">
          <SelectValue placeholder="--" />
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
