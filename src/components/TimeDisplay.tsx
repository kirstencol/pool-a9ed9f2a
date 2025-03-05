
import React from "react";

interface TimeDisplayProps {
  hour: string;
  minute: string;
  period: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ hour, minute, period }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-4xl font-medium flex items-baseline">
        <span>{hour}</span>
        <span className="mx-1">:</span>
        <span>{minute}</span>
      </div>
      <div className="text-gray-500 mt-1">{period}</div>
    </div>
  );
};

export default TimeDisplay;
