
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import TimeSlotCard from "@/components/TimeSlotCard";
import { TimeSlot } from "@/types";
import { Button } from "@/components/ui/button";

interface TimeSlotSelectionProps {
  timeSlots: TimeSlot[];
  responderName: string;
  creatorName: string;
  onSelectTimeSlot: (slot: TimeSlot, startTime: string, endTime: string) => void;
  onCannotMakeIt: () => void;
  onSubmit: () => void;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  timeSlots,
  responderName,
  creatorName,
  onSelectTimeSlot,
  onCannotMakeIt,
  onSubmit,
}) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  const handleSelectTimeSlot = (id: string) => {
    setSelectedSlotId(id);
    const selectedSlot = timeSlots.find(slot => slot.id === id);
    if (selectedSlot) {
      if (responderName === "Burt") {
        const slotDate = selectedSlot.date;
        if (slotDate === "March 1") {
          setSelectedStartTime("8:00 AM");
          setSelectedEndTime("1:30 PM");
        } else if (slotDate === "March 2") {
          setSelectedStartTime("9:00 AM");
          setSelectedEndTime("10:00 AM");
        } else {
          setSelectedStartTime("");
          setSelectedEndTime("");
        }
      } else {
        setSelectedStartTime(selectedSlot.startTime);
        setSelectedEndTime(selectedSlot.endTime);
      }
      
      // Notify parent component of selection
      onSelectTimeSlot(selectedSlot, selectedStartTime, selectedEndTime);
    }
  };

  const handleTimeRangeSelect = (start: string, end: string) => {
    setSelectedStartTime(start);
    setSelectedEndTime(end);
    
    if (selectedSlotId) {
      const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
      if (selectedSlot) {
        onSelectTimeSlot(selectedSlot, start, end);
      }
    }
  };

  return (
    <div>
      <div className="space-y-3">
        {timeSlots.map((timeSlot) => (
          <TimeSlotCard 
            key={timeSlot.id} 
            timeSlot={timeSlot}
            selectedByUser={selectedSlotId === timeSlot.id}
            showTimeSelector={selectedSlotId === timeSlot.id}
            onSelectTime={handleTimeRangeSelect}
            onCannotMakeIt={onCannotMakeIt}
            creatorAvailable
            creatorName={creatorName}
            onClick={() => handleSelectTimeSlot(timeSlot.id)}
          />
        ))}
      </div>
      
      {selectedSlotId && (
        <button 
          onClick={onSubmit} 
          className="action-button"
        >
          Confirm time
          <ArrowRight className="ml-2" size={20} />
        </button>
      )}
    </div>
  );
};

export default TimeSlotSelection;
