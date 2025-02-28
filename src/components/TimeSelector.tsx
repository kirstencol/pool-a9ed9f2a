
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

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
    <div className="flex flex-col items-center bg-white rounded-lg shadow-sm p-1 w-28">
      <button 
        onClick={incrementHour}
        className="w-full flex justify-center py-1 hover:bg-gray-50"
        aria-label="Increment hour"
      >
        <ChevronUp size={16} />
      </button>
      
      <div className="flex justify-center items-center w-full py-1">
        <div className="text-center text-xl font-medium">
          {hour}:{minute.toString().padStart(2, '0')}
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
