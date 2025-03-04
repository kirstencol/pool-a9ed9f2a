
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
  onCannotMakeIt: (e?: React.MouseEvent) => void;  // Updated type to accept an optional event
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

  // Store which time slots have been viewed/configured
  const [configuredSlots, setConfiguredSlots] = useState<Set<string>>(new Set());
  
  // Track which slot is currently expanded
  const [expandedSlotId, setExpandedSlotId] = useState<string | null>(null);

  // Function to toggle slot expansion
  const toggleSlotExpansion = (slotId: string) => {
    if (expandedSlotId === slotId) {
      setExpandedSlotId(null);
    } else {
      setExpandedSlotId(slotId);
      handleSelectTimeSlot(slotId);
      
      // Add this slot to configured slots
      setConfiguredSlots(prev => {
        const newSet = new Set(prev);
        newSet.add(slotId);
        return newSet;
      });
    }
  };

  // Check if any slot has been configured
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
                  
                  // Mark this slot as configured
                  setConfiguredSlots(prev => {
                    const newSet = new Set(prev);
                    newSet.add(timeSlot.id);
                    return newSet;
                  });
                }}
                onCannotMakeIt={(e) => {
                  // Prevent the card click event from firing
                  e?.stopPropagation?.();
                  onCannotMakeIt(e);  // Pass the event to the parent handler
                }}
                creatorAvailable
                creatorName={creatorName}
              />
              
              {isConfigured && !isExpanded && (
                <div className="mt-2 text-sm text-purple-700 font-medium">
                  ✓ You indicated availability for this time
                </div>
              )}
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

// Use memo to prevent unnecessary re-renders
export default memo(TimeSlotSelection);
