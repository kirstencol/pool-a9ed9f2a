
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
      // Always default to creator's availability range
      let startTime = selectedSlot.startTime;
      let endTime = selectedSlot.endTime;
      
      setSelectedStartTime(startTime);
      setSelectedEndTime(endTime);
      
      // Notify parent component of selection
      onSelectTimeSlot(selectedSlot, startTime, endTime);
    }
  }, [timeSlots, selectedSlotId, responderName, onSelectTimeSlot]);

  const handleTimeRangeSelect = useCallback((start: string, end: string) => {
    console.log("useTimeSlotSelection - Time range selected:", start, end);
    
    if (selectedSlotId) {
      const selectedSlot = timeSlots.find(slot => slot.id === selectedSlotId);
      if (selectedSlot) {
        // Ensure selections are within the creator's availability range
        const isValidSelection = isTimeWithinRange(start, end, selectedSlot.startTime, selectedSlot.endTime);
        
        if (isValidSelection) {
          // Only update if times have actually changed
          if (start !== selectedStartTime) {
            setSelectedStartTime(start);
          }
          
          if (end !== selectedEndTime) {
            setSelectedEndTime(end);
          }
          
          // Only propagate changes when both start and end times are valid
          if (start !== "--" && end !== "--") {
            onSelectTimeSlot(selectedSlot, start, end);
          }
        } else {
          console.log("useTimeSlotSelection - Invalid time range selection, outside creator's availability");
        }
      }
    }
  }, [timeSlots, selectedSlotId, selectedStartTime, selectedEndTime, onSelectTimeSlot]);

  // Helper function to check if a time range is within another time range
  const isTimeWithinRange = (start: string, end: string, creatorStart: string, creatorEnd: string): boolean => {
    // If either time is not set, consider it valid (will be handled elsewhere)
    if (start === "--" || end === "--") return true;
    
    // Convert time strings to comparable values (minutes since midnight)
    const startMinutes = convertTimeToMinutes(start);
    const endMinutes = convertTimeToMinutes(end);
    const creatorStartMinutes = convertTimeToMinutes(creatorStart);
    const creatorEndMinutes = convertTimeToMinutes(creatorEnd);
    
    // Check if the selected range is within creator's range
    return (
      startMinutes >= creatorStartMinutes && 
      endMinutes <= creatorEndMinutes
    );
  };

  // Helper function to convert time string (e.g., "2:30 pm") to minutes since midnight
  const convertTimeToMinutes = (timeStr: string): number => {
    if (!timeStr || timeStr === "--") return 0;
    
    const match = timeStr.match(/(\d+):(\d+)\s?(am|pm)/i);
    if (!match) return 0;
    
    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toLowerCase();
    
    // Convert to 24-hour format
    if (period === "pm" && hours < 12) {
      hours += 12;
    } else if (period === "am" && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };

  return {
    selectedSlotId,
    selectedStartTime,
    selectedEndTime,
    handleSelectTimeSlot,
    handleTimeRangeSelect
  };
}
