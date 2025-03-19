
import { useState, useEffect, useMemo } from "react";
import { parseTimeString, buildTimeString, isTimeWithinBounds } from "@/utils/timeUtils";

interface UseTimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  minTime?: string;
  maxTime?: string;
}

export const useTimeSelector = ({
  time,
  onTimeChange,
  isEndTime = false,
  startTime = "",
  minTime = "",
  maxTime = ""
}: UseTimeSelectorProps) => {
  const hourOptions = ["--", "12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  const minuteOptions = ["00", "15", "30", "45"];
  const periods = ["am", "pm"];

  // Parse initial time string into components
  const parsedTime = parseTimeString(time);
  const [hour, setHour] = useState<string>(parsedTime.hour);
  const [minute, setMinute] = useState<string>(parsedTime.minute);
  const [period, setPeriod] = useState<string>(parsedTime.period);

  // Update component state when the time prop changes
  useEffect(() => {
    const { hour: newHour, minute: newMinute, period: newPeriod } = parseTimeString(time);
    setHour(newHour);
    setMinute(newMinute);
    setPeriod(newPeriod);
  }, [time]);

  // Notify parent when time components change
  useEffect(() => {
    if (hour === "--" || period === "") {
      return;
    }
    
    const newTime = buildTimeString(hour, minute, period);
    if (newTime.toLowerCase() !== time.toLowerCase() && newTime !== "--") {
      onTimeChange(newTime);
    }
  }, [hour, minute, period, onTimeChange, time]);

  // Set default period based on startTime (for end time selector)
  useEffect(() => {
    if (isEndTime && startTime && startTime !== "--") {
      const parsed = parseTimeString(startTime);
      if (parsed.period === "pm") {
        setPeriod("pm");
      }
    }
  }, [isEndTime, startTime]);

  // Filter valid hour options based on time constraints
  const validHourOptions = useMemo(() => {
    if (!minTime && !maxTime) {
      return hourOptions;
    }

    return hourOptions.filter(h => {
      if (h === "--") return true;
      
      for (const m of minuteOptions) {
        for (const p of periods) {
          const testTime = buildTimeString(h, m, p);
          
          if (isTimeWithinBounds(testTime, minTime, maxTime, startTime, isEndTime)) {
            return true;
          }
        }
      }
      
      return false;
    });
  }, [hourOptions, minuteOptions, periods, minTime, maxTime, isEndTime, startTime]);

  // Filter valid minute options based on selected hour and constraints
  const validMinuteOptions = useMemo(() => {
    if (hour === "--" || !period) {
      return minuteOptions;
    }

    return minuteOptions.filter(m => {
      const testTime = buildTimeString(hour, m, period);
      return isTimeWithinBounds(testTime, minTime, maxTime, startTime, isEndTime);
    });
  }, [hour, period, minuteOptions, minTime, maxTime, isEndTime, startTime]);

  // Handle time component changes
  const handleHourChange = (value: string) => {
    setHour(value);
    
    // When hour changes, ensure minute is still valid
    const newValidMinutes = minuteOptions.filter(m => {
      const testTime = buildTimeString(value, m, period);
      return isTimeWithinBounds(testTime, minTime, maxTime, startTime, isEndTime);
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
    
    // When period changes, ensure minute is still valid
    const newValidMinutes = minuteOptions.filter(m => {
      const testTime = buildTimeString(hour, m, value);
      return isTimeWithinBounds(testTime, minTime, maxTime, startTime, isEndTime);
    });
    
    if (newValidMinutes.length > 0 && !newValidMinutes.includes(minute)) {
      setMinute(newValidMinutes[0]);
    }
  };

  return {
    hour,
    minute,
    period,
    validHourOptions,
    validMinuteOptions,
    periods,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange
  };
};
