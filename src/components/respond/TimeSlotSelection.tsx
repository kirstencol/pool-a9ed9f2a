
import React from "react";
import { ArrowRight } from "lucide-react";
import TimeSlotCard from "@/components/TimeSlotCard";
import { TimeSlot } from "@/types";
import { Button } from "@/components/ui/button";
import { useTimeSlotSelection } from "@/hooks/useTimeSlotSelection";

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
  const {
    selectedSlotId,
    handleSelectTimeSlot,
    handleTimeRangeSelect
  } = useTimeSlotSelection({
    timeSlots,
    responderName,
    onSelectTimeSlot
  });

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
        <Button 
          onClick={onSubmit} 
          className="w-full mt-4 flex items-center justify-center"
        >
          Confirm time
          <ArrowRight className="ml-2" size={20} />
        </Button>
      )}
    </div>
  );
};

export default TimeSlotSelection;
