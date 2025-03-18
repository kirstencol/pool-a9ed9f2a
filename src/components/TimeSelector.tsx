
import { memo, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTimeSelector } from "@/hooks/useTimeSelector";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
  isEndTime?: boolean;
  startTime?: string;
  minTime?: string;
  maxTime?: string;
  disabled?: boolean;
  className?: string;
}

const TimeSelector = ({ 
  time, 
  onTimeChange, 
  isEndTime = false, 
  startTime = "",
  minTime = "",
  maxTime = "",
  disabled = false,
  className = ""
}: TimeSelectorProps) => {
  const {
    hour,
    minute,
    period,
    validHourOptions,
    validMinuteOptions,
    periods,
    handleHourChange,
    handleMinuteChange,
    handlePeriodChange
  } = useTimeSelector({
    time,
    onTimeChange,
    isEndTime,
    startTime,
    minTime,
    maxTime
  });

  // Group the select components for better readability
  const HourSelect = useMemo(() => (
    <Select 
      value={hour} 
      onValueChange={handleHourChange}
      disabled={disabled}
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
  ), [hour, handleHourChange, validHourOptions, disabled]);

  const MinuteSelect = useMemo(() => (
    <Select 
      value={minute} 
      onValueChange={handleMinuteChange}
      disabled={hour === "--" || disabled}
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
  ), [minute, handleMinuteChange, validMinuteOptions, hour, disabled]);

  const PeriodSelect = useMemo(() => (
    <Select 
      value={period} 
      onValueChange={handlePeriodChange}
      disabled={hour === "--" || disabled}
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
  ), [period, handlePeriodChange, periods, hour, disabled]);

  return (
    <div className={`time-selector-container flex space-x-1 ${className}`}>
      {HourSelect}
      <span className="flex items-center text-gray-400">:</span>
      {MinuteSelect}
      {PeriodSelect}
    </div>
  );
};

export default memo(TimeSelector);
