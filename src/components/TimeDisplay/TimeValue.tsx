
import React from "react";

interface TimeValueProps {
  value: string;
}

const TimeValue: React.FC<TimeValueProps> = ({ value }) => {
  return <span>{value}</span>;
};

export default TimeValue;
