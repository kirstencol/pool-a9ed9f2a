
import { useState, useEffect, useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
}

const TimeSelector = ({ time, onTimeChange }: TimeSelectorProps) => {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"am" | "pm">("am");
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Parse the time string (e.g., "2:00 pm")
    const match = time.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (match) {
      let parsedHour = parseInt(match[1], 10);
      const parsedMinute = parseInt(match[2], 10);
      const parsedPeriod = match[3].toLowerCase() as "am" | "pm";

      // Convert to 12-hour format if needed
      if (parsedHour > 12) {
        parsedHour -= 12;
        setPeriod("pm");
      } else {
        setPeriod(parsedPeriod);
      }

      setHour(parsedHour);
      setMinute(parsedMinute);
    }
  }, [time]);

  const incrementHour = () => {
    setHour(prev => (prev === 12 ? 1 : prev + 1));
    updateTime();
  };

  const decrementHour = () => {
    setHour(prev => (prev === 1 ? 12 : prev - 1));
    updateTime();
  };

  const incrementMinute = () => {
    if (minute === 45) {
      setMinute(0);
      incrementHour();
    } else {
      setMinute(prev => prev + 15);
    }
    updateTime();
  };

  const decrementMinute = () => {
    if (minute === 0) {
      setMinute(45);
      decrementHour();
    } else {
      setMinute(prev => prev - 15);
    }
    updateTime();
  };

  const togglePeriod = () => {
    setPeriod(prev => (prev === "am" ? "pm" : "am"));
    updateTime();
  };

  const updateTime = () => {
    const newTime = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    onTimeChange(newTime);
  };

  useEffect(() => {
    updateTime();
  }, [hour, minute, period]);

  // Handle wheel events for faster scrolling
  const handleHourWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      incrementHour();
    } else {
      decrementHour();
    }
  };

  const handleMinuteWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      incrementMinute();
    } else {
      decrementMinute();
    }
  };

  // Handle touch events for mobile scrolling
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentTarget, setTouchCurrentTarget] = useState<"hour" | "minute" | null>(null);

  const handleTouchStart = (e: React.TouchEvent, target: "hour" | "minute") => {
    setTouchStartY(e.touches[0].clientY);
    setTouchCurrentTarget(target);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (touchStartY === null || touchCurrentTarget === null) return;

    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;

    // Only trigger change after a minimum threshold to avoid accidental changes
    if (Math.abs(deltaY) > 10) {
      if (touchCurrentTarget === "hour") {
        if (deltaY > 0) {
          incrementHour();
        } else {
          decrementHour();
        }
      } else if (touchCurrentTarget === "minute") {
        if (deltaY > 0) {
          incrementMinute();
        } else {
          decrementMinute();
        }
      }
      setTouchStartY(touchY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    setTouchCurrentTarget(null);
  };

  return (
    <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-1 w-28">
      <button 
        onClick={incrementHour}
        className="w-full flex justify-center py-1 hover:bg-gray-50"
        aria-label="Increment hour"
      >
        <ChevronUp size={16} />
      </button>
      
      <div className="flex justify-center items-center w-full py-1">
        <div 
          ref={hourRef}
          className="text-center text-xl font-medium cursor-pointer"
          onWheel={handleHourWheel}
          onTouchStart={(e) => handleTouchStart(e, "hour")}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {hour}
        </div>
        <div className="mx-1">:</div>
        <div 
          ref={minuteRef}
          className="text-center text-xl font-medium cursor-pointer"
          onWheel={handleMinuteWheel}
          onTouchStart={(e) => handleTouchStart(e, "minute")}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {minute.toString().padStart(2, '0')}
        </div>
        <div 
          onClick={togglePeriod}
          className="ml-1 text-sm cursor-pointer font-medium text-gray-500 hover:text-gray-700"
        >
          {period}
        </div>
      </div>
      
      <button 
        onClick={decrementHour}
        className="w-full flex justify-center py-1 hover:bg-gray-50"
        aria-label="Decrement hour"
      >
        <ChevronDown size={16} />
      </button>
    </div>
  );
};

export default TimeSelector;
