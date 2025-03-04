
import { useState, useEffect } from "react";
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

  // Clear selection when timeSlots change
  useEffect(() => {
    console.log("useTimeSlotSelection - timeSlots changed, resetting selection", timeSlots);
    setSelectedSlotId(null);
    setSelectedStartTime("");
    setSelectedEndTime("");
  }, [timeSlots]);

  const handleSelectTimeSlot = (id: string) => {
    console.log("useTimeSlotSelection - Selected slot id:", id);
    setSelectedSlotId(id);
    const selectedSlot = timeSlots.find(slot => slot.id === id);
    
    if (selectedSlot) {
      let startTime = selectedSlot.startTime;
      let endTime = selectedSlot.endTime;
      
      // Set default times based on responder
      if (responderName === "Burt") {
        const slotDate = selectedSlot.date;
        if (slotDate === "March 1") {
          startTime = "8:00 AM";
          endTime = "1:30 PM";
        } else if (slotDate === "March 2") {
          startTime = "9:00 AM";
          endTime = "10:00 AM";
        }
      }
      
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
      
      // Notify parent component of selection
      onSelectTimeSlot(selectedSlot, startTime, endTime);
    }
  };

  const handleTimeRangeSelect = (start: string, end: string) => {
    console.log("useTimeSlotSelection - Time range selected:", start, end);
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
