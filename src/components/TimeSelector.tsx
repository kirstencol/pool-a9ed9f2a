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
  
  const hourOptions = ["--", "12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  const minuteOptions = ["00", "15", "30", "45"];
  const periods = ["am", "pm"];

  useEffect(() => {
    if (!time || time === "--") {
      setHour("--");
      setMinute("00");
      setPeriod("");
      return;
    }

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

  useEffect(() => {
    if (hour === "--" || period === "") {
      return;
    }
    const newTime = `${hour}:${minute} ${period}`;
    
    if (newTime.toLowerCase() !== time.toLowerCase()) {
      onTimeChange(newTime);
    }
  }, [hour, minute, period, onTimeChange, time]);

  useEffect(() => {
    if (isEndTime && startTime && startTime !== "--") {
      const match = startTime.match(/(\d+):(\d+)\s?(am|pm)/i);
      if (match) {
        const startPeriod = match[3].toLowerCase();
        if (startPeriod === "pm") {
          setPeriod("pm");
        }
      }
    }
  }, [isEndTime, startTime]);

  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr === "--") return 0;
    
    const match = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toLowerCase();
    
    if (period === "pm" && hours < 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  const validHourOptions = useMemo(() => {
    if (!minTime && !maxTime) {
      return hourOptions;
    }

    const minMinutes = minTime ? convertTimeToMinutes(minTime) : 0;
    const maxMinutes = maxTime ? convertTimeToMinutes(maxTime) : 24 * 60 - 1;

    return hourOptions.filter(h => {
      if (h === "--") return true;
      
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

  const handleHourChange = (value: string) => {
    setHour(value);
    
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
      <Select 
        value={hour} 
        onValueChange={handleHourChange}
      >
        <SelectTrigger className="w-12 px-2 bg-white">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50 min-w-[4rem] shadow-md">
          {validHourOptions.map((h) => (
            <SelectItem 
              key={h} 
              value={h}
              className="cursor-pointer hover:bg-gray-100"
            >
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={minute} 
        onValueChange={handleMinuteChange}
        disabled={hour === "--"}
      >
        <SelectTrigger className="w-14 px-2 bg-white">
          <SelectValue placeholder="00" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50 min-w-[4rem] shadow-md">
          {validMinuteOptions.map((m) => (
            <SelectItem 
              key={m} 
              value={m}
              className="cursor-pointer hover:bg-gray-100"
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={period} 
        onValueChange={handlePeriodChange}
        disabled={hour === "--"}
      >
        <SelectTrigger className="w-14 px-2 bg-white">
          <SelectValue placeholder="--" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50 min-w-[4rem] shadow-md">
          {periods.map((p) => (
            <SelectItem 
              key={p} 
              value={p} 
              className="cursor-pointer hover:bg-gray-100"
            >
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default memo(TimeSelector);
