
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { TimeSlot } from "@/types";
import { validateTimeRange } from "@/components/ProposeTime/TimeValidationUtils";

export const useProposeTime = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    addTimeSlotsBatch, 
    clearTimeSlots 
  } = useMeeting();
  
  const [timeSlots, setTimeSlots] = useState<{
    date: string;
    startTime: string;
    endTime: string;
    isValid: boolean;
  }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with empty time slots if none exist
  useEffect(() => {
    console.log("ProposeTime: Initializing component");
    
    if (timeSlots.length === 0) {
      setTimeSlots([
        { date: "", startTime: "--", endTime: "--", isValid: true },
        { date: "", startTime: "--", endTime: "--", isValid: true },
        { date: "", startTime: "--", endTime: "--", isValid: true }
      ]);
    }

    // Redirect if no current user
    if (!currentUser) {
      navigate("/");
    }
  }, [timeSlots.length, navigate, currentUser]);

  const updateTimeSlot = (index: number, field: keyof Omit<TimeSlot, "id" | "responses">, value: string) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { 
      ...updatedSlots[index], 
      [field]: value 
    };
    
    if (field === "startTime" || field === "endTime") {
      const startTime = field === "startTime" ? value : updatedSlots[index].startTime;
      const endTime = field === "endTime" ? value : updatedSlots[index].endTime;
      
      if (startTime !== "--" && endTime !== "--") {
        updatedSlots[index].isValid = validateTimeRange(startTime, endTime);
      }
    }
    
    setTimeSlots(updatedSlots);
  };

  const clearTimeSlot = (index: number) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[index] = { 
      date: "", 
      startTime: "--", 
      endTime: "--", 
      isValid: true 
    };
    setTimeSlots(updatedSlots);
  };

  const handleSendToFriends = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log("ProposeTime: Adding time slots to context...");
      
      // Clear existing time slots first
      await clearTimeSlots();
      console.log("ProposeTime: Cleared existing time slots");
      
      // Filter valid time slots
      const validSlots = timeSlots.filter(slot => 
        slot.date && slot.startTime !== "--" && slot.endTime !== "--" && slot.isValid
      );
      
      console.log(`ProposeTime: Found ${validSlots.length} valid time slots to add:`, validSlots);
      
      if (validSlots.length === 0) {
        setIsSubmitting(false);
        return;
      }
      
      // Convert to TimeSlot format with IDs
      const timeSlotsToAdd = validSlots.map(slot => ({
        id: crypto.randomUUID(),
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        responses: [],
      }));
      
      // Add all time slots at once using the batch method
      const addedSlots = await addTimeSlotsBatch(timeSlotsToAdd);
      console.log("ProposeTime: Successfully added time slots in batch:", addedSlots);
      
      // Double-check that slots were added before navigating
      if (addedSlots.length > 0) {
        console.log(`ProposeTime: Successfully added ${addedSlots.length} time slots. Navigating to confirmation page.`);
        navigate("/time-confirmation");
      } else {
        console.error("ProposeTime: No time slots were added. Staying on propose time page.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error adding time slots:", error);
      setIsSubmitting(false);
    }
  };

  return {
    timeSlots,
    isSubmitting,
    updateTimeSlot,
    clearTimeSlot,
    handleSendToFriends,
    currentUser
  };
};
