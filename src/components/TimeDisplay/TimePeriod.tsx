
import React from "react";

interface TimePeriodProps {
  period: string;
}

const TimePeriod: React.FC<TimePeriodProps> = ({ period }) => {
  return <div className="text-gray-500 mt-1">{period}</div>;
};

export default TimePeriod;
