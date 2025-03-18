
import { useState, useEffect } from "react";
import { TimeSlot } from "@/types";
import TimeSlotSelection from "./TimeSlotSelection";
import Loading from "@/components/Loading";
import { useLoadingState } from "@/hooks/useLoadingState";
import TimeSlotLoader from "./TimeSlotLoader";
import { useResponseSubmitter } from "@/hooks/useResponseSubmitter";
import NoTimeSlotsView from "./NoTimeSlotsView";
import { initializeDemoData } from "@/context/meeting/storage";

interface ResponseFormProps {
  creatorName: string;
  responderName: string;
  inviteId: string | undefined;
}

const ResponseForm: React.FC<ResponseFormProps> = ({
  creatorName,
  responderName,
  inviteId
}) => {
  const [localTimeSlots, setLocalTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Map<string, {slot: TimeSlot, startTime: string, endTime: string}>>(new Map());
  
  // Use a longer minimum loading time to ensure all data is loaded
  const { isLoading, finishLoading } = useLoadingState({
    minimumLoadingTime: 800,
    safetyTimeoutDuration: 3000
  });
  
  // Initialize demo data on component mount
  useEffect(() => {
    const init = async () => {
      await initializeDemoData();
      console.log("ResponseForm - Initialized demo data on mount");
    };
    
    init();
  }, []);

  // Get response handlers from the submitter hook
  const { handleSubmit, handleCantMakeIt } = useResponseSubmitter({
    selectedTimeSlots: Array.from(selectedTimeSlots.values()),
    responderName,
    inviteId
  });

  const handleSelectTimeSlot = (slot: TimeSlot, startTime: string, endTime: string) => {
    setSelectedTimeSlots(prev => {
      const newMap = new Map(prev);
      newMap.set(slot.id, { slot, startTime, endTime });
      return newMap;
    });
    console.log("Selected time slot:", slot, startTime, endTime);
  };

  // Check if time slots are loaded from the TimeSlotLoader component
  const timeSlotsLoaded = localTimeSlots && localTimeSlots.length > 0;
  
  return (
    <div className="mb-6">
      {/* This component handles loading time slots */}
      <TimeSlotLoader
        inviteId={inviteId}
        localTimeSlots={localTimeSlots}
        setLocalTimeSlots={setLocalTimeSlots}
        onTimeSlotsLoaded={finishLoading}
      />
      
      {/* Show loading state while time slots are being loaded */}
      {isLoading ? (
        <Loading message="Preparing time slots..." subtitle="Just a moment while we get your options ready" />
      ) : !timeSlotsLoaded ? (
        <NoTimeSlotsView />
      ) : (
        <TimeSlotSelection
          timeSlots={localTimeSlots}
          responderName={responderName}
          creatorName={creatorName}
          onSelectTimeSlot={handleSelectTimeSlot}
          onCannotMakeIt={handleCantMakeIt}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ResponseForm;
