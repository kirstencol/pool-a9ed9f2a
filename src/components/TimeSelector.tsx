
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface TimeSelectorProps {
  time: string;
  onTimeChange: (time: string) => void;
}

const TimeSelector = ({ time, onTimeChange }: TimeSelectorProps) => {
  const [hour, setHour] = useState<number>(0);
  const [minute, setMinute] = useState<number>(0);
  const [period, setPeriod] = useState<"am" | "pm">("am");

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

  return (
    <div className="time-input flex flex-col items-center">
      <div className="flex flex-col items-center">
        <button 
          onClick={incrementHour}
          className="time-selector-arrow"
          aria-label="Increment hour"
        >
          <ArrowUp size={16} />
        </button>
        <div className="time-selector w-12 text-center font-medium">{hour}</div>
        <button 
          onClick={decrementHour}
          className="time-selector-arrow"
          aria-label="Decrement hour"
        >
          <ArrowDown size={16} />
        </button>
      </div>
      <div className="text-center font-medium">:</div>
      <div className="flex flex-col items-center">
        <button 
          onClick={incrementMinute}
          className="time-selector-arrow"
          aria-label="Increment minute"
        >
          <ArrowUp size={16} />
        </button>
        <div className="time-selector w-12 text-center font-medium">{minute.toString().padStart(2, '0')}</div>
        <button 
          onClick={decrementMinute}
          className="time-selector-arrow"
          aria-label="Decrement minute"
        >
          <ArrowDown size={16} />
        </button>
      </div>
      <div
        onClick={togglePeriod}
        className="time-selector w-10 text-center text-sm cursor-pointer font-medium"
      >
        {period}
      </div>
    </div>
  );
};

export default TimeSelector;
