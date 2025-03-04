
import { useState, useEffect } from "react";
import { TimeSlot } from "@/types";
import TimeSlotSelection from "./TimeSlotSelection";
import Loading from "@/components/Loading";
import { useLoadingState } from "@/hooks/useLoadingState";
import TimeSlotLoader from "./TimeSlotLoader";
import ResponseSubmitter from "./ResponseSubmitter";
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
  
  const { isLoading, finishLoading } = useLoadingState();
  
  // Initialize demo data on component mount
  useEffect(() => {
    initializeDemoData();
    console.log("ResponseForm - Initialized demo data on mount");
  }, []);

  // Get response handlers from the submitter component
  const responseSubmitter = ResponseSubmitter({
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

  // Render loading state
  if (isLoading) {
    return <Loading message="Preparing time slots..." subtitle="Just a moment while we get your options ready" />;
  }

  // Render empty state if no time slots
  if (!localTimeSlots || localTimeSlots.length === 0) {
    return <NoTimeSlotsView />;
  }

  // Render time slot selection
  return (
    <div className="mb-6">
      {/* This component handles loading time slots */}
      <TimeSlotLoader
        inviteId={inviteId}
        localTimeSlots={localTimeSlots}
        setLocalTimeSlots={setLocalTimeSlots}
        onTimeSlotsLoaded={finishLoading}
      />
      
      <TimeSlotSelection
        timeSlots={localTimeSlots}
        responderName={responderName}
        creatorName={creatorName}
        onSelectTimeSlot={handleSelectTimeSlot}
        onCannotMakeIt={responseSubmitter.handleCantMakeIt}
        onSubmit={responseSubmitter.handleSubmit}
      />
    </div>
  );
};

export default ResponseForm;
