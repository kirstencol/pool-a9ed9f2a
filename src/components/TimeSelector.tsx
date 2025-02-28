
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
  
  const hourWheelRef = useRef<HTMLDivElement>(null);
  const minuteWheelRef = useRef<HTMLDivElement>(null);
  const periodWheelRef = useRef<HTMLDivElement>(null);

  // Generate hour, minute, and period options
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 4 }, (_, i) => i * 15);
  const periods = ["am", "pm"];

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

  const updateTime = () => {
    const newTime = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
    onTimeChange(newTime);
  };

  useEffect(() => {
    updateTime();
  }, [hour, minute, period]);

  // Helper functions for wheel scrolling
  const handleWheelScroll = (
    e: React.WheelEvent | TouchEvent,
    values: number[] | string[],
    currentValue: number | string,
    setter: (value: any) => void
  ) => {
    e.preventDefault();
    const delta = 'deltaY' in e ? e.deltaY : getYDelta(e);
    const currentIndex = values.indexOf(currentValue);
    
    if (delta > 0) {
      // Scroll down - go to next value
      const newIndex = (currentIndex + 1) % values.length;
      setter(values[newIndex]);
    } else if (delta < 0) {
      // Scroll up - go to previous value
      const newIndex = (currentIndex - 1 + values.length) % values.length;
      setter(values[newIndex]);
    }
  };

  // Touch handling
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentTarget, setTouchCurrentTarget] = useState<"hour" | "minute" | "period" | null>(null);

  const handleTouchStart = (e: React.TouchEvent, target: "hour" | "minute" | "period") => {
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
        handleWheelScroll(
          { deltaY: deltaY } as any,
          hours,
          hour,
          setHour
        );
      } else if (touchCurrentTarget === "minute") {
        handleWheelScroll(
          { deltaY: deltaY } as any,
          minutes,
          minute,
          setMinute
        );
      } else if (touchCurrentTarget === "period") {
        handleWheelScroll(
          { deltaY: deltaY } as any,
          periods,
          period,
          setPeriod
        );
      }
      setTouchStartY(touchY);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartY(null);
    setTouchCurrentTarget(null);
  };

  const getYDelta = (e: TouchEvent): number => {
    if (!touchStartY) return 0;
    const currentY = e.touches[0].clientY;
    return touchStartY - currentY;
  };

  return (
    <div className="relative flex flex-row bg-white rounded-lg shadow-sm p-1 w-auto">
      {/* iOS-style wheel picker container */}
      <div className="picker-container flex space-x-1 items-center h-32 overflow-hidden">
        {/* Hour wheel */}
        <div className="wheel-container relative w-12 h-full overflow-hidden">
          <div 
            ref={hourWheelRef}
            className="wheel flex flex-col items-center" 
            onWheel={(e) => handleWheelScroll(e, hours, hour, setHour)}
            onTouchStart={(e) => handleTouchStart(e, "hour")}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="picker-gradient-top absolute top-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="picker-items flex flex-col items-center justify-center py-12">
              {hours.map((h) => (
                <div 
                  key={h} 
                  className={`picker-item py-2 ${
                    h === hour ? "text-black font-bold text-xl" : "text-gray-400 text-lg"
                  }`}
                  onClick={() => setHour(h)}
                >
                  {h}
                </div>
              ))}
            </div>
            <div className="picker-gradient-bottom absolute bottom-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10"></div>
          </div>
        </div>

        <div className="text-xl">:</div>

        {/* Minute wheel */}
        <div className="wheel-container relative w-12 h-full overflow-hidden">
          <div 
            ref={minuteWheelRef}
            className="wheel flex flex-col items-center" 
            onWheel={(e) => handleWheelScroll(e, minutes, minute, setMinute)}
            onTouchStart={(e) => handleTouchStart(e, "minute")}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="picker-gradient-top absolute top-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="picker-items flex flex-col items-center justify-center py-12">
              {minutes.map((m) => (
                <div 
                  key={m} 
                  className={`picker-item py-2 ${
                    m === minute ? "text-black font-bold text-xl" : "text-gray-400 text-lg"
                  }`}
                  onClick={() => setMinute(m)}
                >
                  {m.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
            <div className="picker-gradient-bottom absolute bottom-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10"></div>
          </div>
        </div>

        {/* Period wheel (AM/PM) */}
        <div className="wheel-container relative w-14 h-full overflow-hidden">
          <div 
            ref={periodWheelRef}
            className="wheel flex flex-col items-center" 
            onWheel={(e) => handleWheelScroll(e, periods, period, setPeriod)}
            onTouchStart={(e) => handleTouchStart(e, "period")}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="picker-gradient-top absolute top-0 w-full h-12 bg-gradient-to-b from-white to-transparent z-10"></div>
            <div className="picker-items flex flex-col items-center justify-center py-12">
              {periods.map((p) => (
                <div 
                  key={p} 
                  className={`picker-item py-2 ${
                    p === period ? "text-black font-bold text-xl" : "text-gray-400 text-lg"
                  }`}
                  onClick={() => setPeriod(p as "am" | "pm")}
                >
                  {p}
                </div>
              ))}
            </div>
            <div className="picker-gradient-bottom absolute bottom-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-10"></div>
          </div>
        </div>
      </div>
      
      {/* Highlight for the selected time */}
      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-10 bg-gray-100 bg-opacity-60 rounded-md pointer-events-none"></div>
      
      {/* Up/down controls for keyboard accessibility */}
      <div className="flex flex-col absolute right-1 h-full justify-between py-2">
        <button 
          onClick={() => {
            const currentIndex = hours.indexOf(hour);
            const newIndex = (currentIndex - 1 + hours.length) % hours.length;
            setHour(hours[newIndex]);
          }}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Scroll up"
        >
          <ChevronUp size={16} />
        </button>
        <button 
          onClick={() => {
            const currentIndex = hours.indexOf(hour);
            const newIndex = (currentIndex + 1) % hours.length;
            setHour(hours[newIndex]);
          }}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Scroll down"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};

export default TimeSelector;
