
import { useState, useEffect } from "react";
import { TimeSlot } from "@/types";
import TimeSlotSelection from "./TimeSlotSelection";
import Loading from "@/components/Loading";
import { useLoadingState } from "@/hooks/useLoadingState";
import TimeSlotLoader from "./TimeSlotLoader";
import { useResponseSubmitter } from "./ResponseSubmitter";
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
  const [currentSelectedSlot, setCurrentSelectedSlot] = useState<TimeSlot | null>(null);
  const [currentStartTime, setCurrentStartTime] = useState("");
  const [currentEndTime, setCurrentEndTime] = useState("");
  
  // Use a longer minimum loading time to ensure all data is loaded
  const { isLoading, finishLoading } = useLoadingState({
    minimumLoadingTime: 1500,
    safetyTimeoutDuration: 5000
  });
  
  // Initialize demo data on component mount
  useEffect(() => {
    initializeDemoData();
    console.log("ResponseForm - Initialized demo data on mount");
  }, []);

  // Get response handlers from the submitter hook
  const { handleSubmit, handleCantMakeIt } = useResponseSubmitter({
    currentSelectedSlot,
    currentStartTime,
    currentEndTime,
    responderName,
    inviteId
  });

  const handleSelectTimeSlot = (slot: TimeSlot, startTime: string, endTime: string) => {
    setCurrentSelectedSlot(slot);
    setCurrentStartTime(startTime);
    setCurrentEndTime(endTime);
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
