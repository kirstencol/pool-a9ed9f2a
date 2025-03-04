
import { useState, useEffect, memo, useMemo } from "react";
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
  minTime?: string; // Minimum selectable time
  maxTime?: string; // Maximum selectable time
}

const TimeSelector = ({ 
  time, 
  onTimeChange, 
  isEndTime = false, 
  startTime = "",
  minTime = "",
  maxTime = ""
}: TimeSelectorProps) => {
  const [hour, setHour] = useState<string>("--");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("");
  
  // Generate hour options (12, 1, 2, ..., 11)
  const hourOptions = ["--", "12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  // Generate minute options in 15-minute increments (00, 15, 30, 45)
  const minuteOptions = ["00", "15", "30", "45"];
  const periods = ["am", "pm"];

  // Parse the incoming time (only when it changes)
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
  // Using a separate useEffect to avoid creating new functions on each render
  useEffect(() => {
    if (hour === "--" || period === "") {
      return;
    }
    const newTime = `${hour}:${minute} ${period}`;
    
    // Only call onTimeChange if the formatted time is different from current time
    // This prevents circular updates
    if (newTime.toLowerCase() !== time.toLowerCase()) {
      onTimeChange(newTime);
    }
  }, [hour, minute, period, onTimeChange, time]);

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

  // Convert time string to minutes for comparison
  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr === "--") return 0;
    
    const match = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toLowerCase();
    
    // Convert to 24-hour format
    if (period === "pm" && hours < 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  // Calculate valid hour options based on constraints
  const validHourOptions = useMemo(() => {
    if (!minTime && !maxTime) {
      return hourOptions;
    }

    const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
    const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;

    return hourOptions.filter(h => {
      if (h === "--") return true;
      
      // For each hour, check if any minute combination would be valid
      for (const m of minuteOptions) {
        for (const p of periods) {
          const testTime = `${h}:${m} ${p}`;
          const testMinutes = convertTimeToMinutes(testTime);
          
          if (isEndTime && startTime && startTime !== "--") {
            const startMinutes = convertTimeToMinutes(startTime);
            if (testMinutes > startMinutes && testMinutes <= maxMinutes) {
              return true;
            }
          } else {
            if (testMinutes >= minMinutes && testMinutes < maxMinutes) {
              return true;
            }
          }
        }
      }
      
      return false;
    });
  }, [hourOptions, minuteOptions, periods, minTime, maxTime, isEndTime, startTime]);

  // Calculate valid minute options based on constraints
  const validMinuteOptions = useMemo(() => {
    if (hour === "--" || !period) {
      return minuteOptions;
    }

    const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
    const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;

    return minuteOptions.filter(m => {
      const testTime = `${hour}:${m} ${period}`;
      const testMinutes = convertTimeToMinutes(testTime);
      
      if (isEndTime && startTime && startTime !== "--") {
        const startMinutes = convertTimeToMinutes(startTime);
        return testMinutes > startMinutes && testMinutes <= maxMinutes;
      } else {
        return testMinutes >= minMinutes && testMinutes < maxMinutes;
      }
    });
  }, [hour, period, minuteOptions, minTime, maxTime, isEndTime, startTime]);

  // Handler functions that avoid closures on time state
  const handleHourChange = (value: string) => {
    setHour(value);
    
    // If we're changing to a new hour and current minute is invalid, reset to first valid option
    const newValidMinutes = minuteOptions.filter(m => {
      const testTime = `${value}:${m} ${period}`;
      const testMinutes = convertTimeToMinutes(testTime);
      const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
      const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;
      
      if (isEndTime && startTime && startTime !== "--") {
        const startMinutes = convertTimeToMinutes(startTime);
        return testMinutes > startMinutes && testMinutes <= maxMinutes;
      } else {
        return testMinutes >= minMinutes && testMinutes < maxMinutes;
      }
    });
    
    if (newValidMinutes.length > 0 && !newValidMinutes.includes(minute)) {
      setMinute(newValidMinutes[0]);
    }
  };

  const handleMinuteChange = (value: string) => {
    setMinute(value);
  };

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    
    // Similar check for minute validity when period changes
    const newValidMinutes = minuteOptions.filter(m => {
      const testTime = `${hour}:${m} ${value}`;
      const testMinutes = convertTimeToMinutes(testTime);
      const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
      const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;
      
      if (isEndTime && startTime && startTime !== "--") {
        const startMinutes = convertTimeToMinutes(startTime);
        return testMinutes > startMinutes && testMinutes <= maxMinutes;
      } else {
        return testMinutes >= minMinutes && testMinutes < maxMinutes;
      }
    });
    
    if (newValidMinutes.length > 0 && !newValidMinutes.includes(minute)) {
      setMinute(newValidMinutes[0]);
    }
  };

  return (
    <div className="time-selector-container flex space-x-1">
      {/* Hour selector */}
      <Select 
        value={hour} 
        onValueChange={handleHourChange}
      >
        <SelectTrigger className="w-12 px-2">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent>
          {validHourOptions.map((h) => (
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
        onValueChange={handleMinuteChange}
        disabled={hour === "--"}
      >
        <SelectTrigger className="w-14 px-2">
          <SelectValue placeholder="00" />
        </SelectTrigger>
        <SelectContent>
          {validMinuteOptions.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AM/PM selector (only enabled if hour is selected) */}
      <Select 
        value={period} 
        onValueChange={handlePeriodChange}
        disabled={hour === "--"}
      >
        <SelectTrigger className="w-14 px-2">
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

// Memoize the component to prevent unnecessary re-renders
export default memo(TimeSelector);
