
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
}

const TimeSelector = ({ time, onTimeChange }: TimeSelectorProps) => {
  const [hour, setHour] = useState<string>("9");
  const [minute, setMinute] = useState<string>("00");
  const [period, setPeriod] = useState<string>("am");

  useEffect(() => {
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

  useEffect(() => {
    const newTime = `${hour}:${minute} ${period}`;
    onTimeChange(newTime);
  }, [hour, minute, period, onTimeChange]);

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const minutes = ["00", "15", "30", "45"];
  const periods = ["am", "pm"];

  return (
    <div className="time-selector-container flex space-x-1">
      <Select value={hour} onValueChange={(value) => setHour(value)}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder={hour} />
        </SelectTrigger>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="flex items-center">:</span>

      <Select value={minute} onValueChange={(value) => setMinute(value)}>
        <SelectTrigger className="w-16">
          <SelectValue placeholder={minute} />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
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
