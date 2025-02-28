
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";

interface DateTimePickerProps {
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const DateTimePicker = ({ 
  onDateChange, 
  onStartTimeChange, 
  onEndTimeChange 
}: DateTimePickerProps) => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
    onDateChange(e.target.value);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    onStartTimeChange(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    onEndTimeChange(e.target.value);
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="mb-4 flex items-center">
        <Calendar className="mr-2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="mm/dd/yyyy"
          className="w-full border-b border-gray-300 focus:border-purple-DEFAULT focus:outline-none py-2"
          value={date}
          onChange={handleDateChange}
        />
      </div>
      <div className="flex items-center">
        <Clock className="mr-2 text-gray-500" size={20} />
        <div className="flex justify-between w-full">
          <input
            type="text"
            placeholder="From"
            className="border-b border-gray-300 focus:border-purple-DEFAULT focus:outline-none py-2 w-40"
            value={startTime}
            onChange={handleStartTimeChange}
          />
          <span className="text-gray-500 px-4 py-2">To</span>
          <input
            type="text"
            placeholder="To"
            className="border-b border-gray-300 focus:border-purple-DEFAULT focus:outline-none py-2 w-40"
            value={endTime}
            onChange={handleEndTimeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
