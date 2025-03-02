
import { useState } from "react";
import { TimeSlot } from "@/types";

interface UseTimeSlotSelectionProps {
  timeSlots: TimeSlot[];
  responderName: string;
  onSelectTimeSlot: (slot: TimeSlot, startTime: string, endTime: string) => void;
}

export function useTimeSlotSelection({
  timeSlots,
  responderName,
  onSelectTimeSlot,
}: UseTimeSlotSelectionProps) {
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

  return {
    selectedSlotId,
    selectedStartTime,
    selectedEndTime,
    handleSelectTimeSlot,
    handleTimeRangeSelect
  };
}
