
import React from "react";
import TimeValue from "./TimeValue";
import TimeSeparator from "./TimeSeparator";
import TimePeriod from "./TimePeriod";

interface TimeDisplayProps {
  hour: string;
  minute: string;
  period: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ hour, minute, period }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-4xl font-medium flex items-baseline">
        <TimeValue value={hour} />
        <TimeSeparator />
        <TimeValue value={minute} />
      </div>
      <TimePeriod period={period} />
    </div>
  );
};

export default TimeDisplay;
