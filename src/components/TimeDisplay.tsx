import React, { useEffect, useRef } from "react";

interface TimeDisplayProps {
  hour: string;
  minute: string;
  period: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ hour, minute, period }) => {
  // Keep track of renders and prop changes
  const renderCount = useRef(0);
  const prevProps = useRef({ hour, minute, period });
  
  // Log when props change
  useEffect(() => {
    renderCount.current += 1;
    
    const propsChanged = 
      prevProps.current.hour !== hour ||
      prevProps.current.minute !== minute ||
      prevProps.current.period !== period;
    
    console.log(`📱 TimeDisplay render #${renderCount.current} with props:`, { hour, minute, period });
    
    if (propsChanged) {
      console.log(`📱 TimeDisplay PROPS CHANGED from:`, prevProps.current, `to:`, { hour, minute, period });
      prevProps.current = { hour, minute, period };
    } else {
      console.log(`📱 TimeDisplay re-rendered with same props`);
    }
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center pointer-events-none">
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
