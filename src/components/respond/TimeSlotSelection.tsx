
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

  // Store if we've had a selection to ensure we render time selectors
  const hasSelection = selectedSlotId !== null;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {timeSlots.map((timeSlot) => {
          const isSelected = selectedSlotId === timeSlot.id;
          
          return (
            <div 
              key={timeSlot.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? "border-purple-500 bg-purple-50 shadow-sm" 
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => handleSelectTimeSlot(timeSlot.id)}
            >
              <TimeSlotCard 
                timeSlot={timeSlot}
                selectedByUser={isSelected}
                showTimeSelector={isSelected}
                onSelectTime={handleTimeRangeSelect}
                onCannotMakeIt={onCannotMakeIt}
                creatorAvailable
                creatorName={creatorName}
              />
            </div>
          );
        })}
      </div>
      
      {hasSelection && (
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
