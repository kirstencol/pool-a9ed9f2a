
import { useState } from "react";
import DateTimePicker from "@/components/DateTimePicker";
import { TimeSlot } from "@/types";

interface TimeSlotFormProps {
  index: number;
  timeSlot: {
    date: string;
    startTime: string;
    endTime: string;
    isValid: boolean;
  };
  updateTimeSlot: (index: number, field: keyof Omit<TimeSlot, "id" | "responses">, value: string) => void;
  clearTimeSlot: (index: number) => void;
}

const TimeSlotForm = ({ index, timeSlot, updateTimeSlot, clearTimeSlot }: TimeSlotFormProps) => {
  return (
    <div 
      className={`p-3 sm:p-4 ${!timeSlot.isValid ? 'border border-red-500 rounded-xl' : ''}`}
    >
      <DateTimePicker
        onDateChange={(date) => updateTimeSlot(index, "date", date)}
        onStartTimeChange={(time) => updateTimeSlot(index, "startTime", time)}
        onEndTimeChange={(time) => updateTimeSlot(index, "endTime", time)}
        startTime={timeSlot.startTime}
        endTime={timeSlot.endTime}
        isValid={timeSlot.isValid}
        onClear={() => clearTimeSlot(index)}
      />
    </div>
  );
};

export default TimeSlotForm;
