
import React, { memo, useState } from "react";
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
  onCannotMakeIt: (e?: React.MouseEvent) => void;
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

  const [configuredSlots, setConfiguredSlots] = useState<Set<string>>(new Set());
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);

  const toggleSlotExpansion = (slotId: string) => {
    if (expandedSlotId === slotId) {
      setExpandedSlotId(null);
    } else {
      setExpandedSlotId(slotId);
      handleSelectTimeSlot(slotId);
      
      setConfiguredSlots(prev => {
        const newSet = new Set(prev);
        newSet.add(slotId);
        return newSet;
      });
    }
  };

  const handleSlotCannotMakeIt = (slotId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Remove this slot from configured slots
    setConfiguredSlots(prev => {
      const newSet = new Set(prev);
      newSet.delete(slotId);
      return newSet;
    });
    
    // If this was the expanded slot, collapse it
    if (expandedSlotId === slotId) {
      setExpandedSlotId(null);
    }
  };

  const hasConfiguredSlots = configuredSlots.size > 0;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {timeSlots.map((timeSlot) => {
          const isSelected = selectedSlotId === timeSlot.id;
          const isExpanded = expandedSlotId === timeSlot.id;
          const isConfigured = configuredSlots.has(timeSlot.id);
          
          return (
            <div 
              key={timeSlot.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isConfigured 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-purple-300"
              } ${
                isExpanded 
                  ? "shadow-md" 
                  : ""
              }`}
              onClick={() => toggleSlotExpansion(timeSlot.id)}
            >
              <TimeSlotCard 
                timeSlot={timeSlot}
                selectedByUser={isConfigured}
                showTimeSelector={isExpanded}
                onSelectTime={(start, end) => {
                  handleTimeRangeSelect(start, end);
                  
                  setConfiguredSlots(prev => {
                    const newSet = new Set(prev);
                    newSet.add(timeSlot.id);
                    return newSet;
                  });
                }}
                onCannotMakeIt={(e) => {
                  handleSlotCannotMakeIt(timeSlot.id, e);
                }}
                creatorAvailable
                creatorName={creatorName}
              />
            </div>
          );
        })}
      </div>
      
      {hasConfiguredSlots && (
        <Button 
          onClick={onSubmit} 
          className="w-full mt-4 flex items-center justify-center"
        >
          Confirm times
          <ArrowRight className="ml-2" size={20} />
        </Button>
      )}
    </div>
  );
};

export default memo(TimeSlotSelection);
