
import { useState, useEffect, useCallback } from "react";
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
  
  // Only reset selections when timeSlots array reference changes AND is not empty
  // and only if the currently selected slot no longer exists
  useEffect(() => {
    if (timeSlots && timeSlots.length > 0 && selectedSlotId) {
      console.log("useTimeSlotSelection - Checking if selected slot still exists", {selectedSlotId, timeSlots});
      // Only reset the selection if the currently selected slot no longer exists
      const slotExists = timeSlots.some(slot => slot.id === selectedSlotId);
      if (!slotExists) {
        console.log("useTimeSlotSelection - Selected slot no longer exists, resetting selection");
        setSelectedSlotId(null);
        setSelectedStartTime("");
        setSelectedEndTime("");
      }
    }
  }, [timeSlots, selectedSlotId]);

  const handleSelectTimeSlot = useCallback((id: string) => {
    console.log("useTimeSlotSelection - Selected slot id:", id);
    
    // If clicking the same slot again, keep the selection
    if (id === selectedSlotId) {
      console.log("useTimeSlotSelection - Same slot selected, maintaining selection");
      return;
    }
    
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
  }, [timeSlots, selectedSlotId, responderName, onSelectTimeSlot]);

  const handleTimeRangeSelect = useCallback((start: string, end: string) => {
    console.log("useTimeSlotSelection - Time range selected:", start, end);
    
    // Only update if times have actually changed
    if (start !== selectedStartTime) {
      setSelectedStartTime(start);
    }
    
    if (end !== selectedEndTime) {
      setSelectedEndTime(end);
    }
    
    if (selectedSlotId) {
      const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
      if (selectedSlot) {
        // Only propagate changes when both start and end times are valid
        if (start !== "--" && end !== "--") {
          onSelectTimeSlot(selectedSlot, start, end);
        }
      }
    }
  }, [timeSlots, selectedSlotId, selectedStartTime, selectedEndTime, onSelectTimeSlot]);

  return {
    selectedSlotId,
    selectedStartTime,
    selectedEndTime,
    handleSelectTimeSlot,
    handleTimeRangeSelect
  };
}
