
import { useState, useEffect, useCallback, useRef } from "react";
import { TimeSlot } from "@/types";
import TimeSlotSelection from "./TimeSlotSelection";
import Loading from "@/components/Loading";
import { useLoadingState } from "@/hooks/useLoadingState";
import TimeSlotLoader from "./TimeSlotLoader";
import { useResponseSubmitter } from "@/hooks/useResponseSubmitter";
import NoTimeSlotsView from "./NoTimeSlotsView";
import { initializeDemoData } from "@/context/meeting/storage";
import { isDemoId } from "@/context/meeting/storage/demoData";

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
  const [initDone, setInitDone] = useState(false);
  const initAttemptedRef = useRef(false);
  
  // Use shorter loading times for demo flows
  const { isLoading, finishLoading, startLoading } = useLoadingState({
    minimumLoadingTime: isDemoId(inviteId || "") ? 100 : 200,
    safetyTimeoutDuration: 1000
  });
  
  // Initialize demo data on component mount
  useEffect(() => {
    const initDemo = async () => {
      if (initAttemptedRef.current) return;
      initAttemptedRef.current = true;
      
      console.log("ResponseForm - Starting demo data initialization");
      
      try {
        await initializeDemoData();
        console.log("ResponseForm - Demo data initialized");
      } catch (err) {
        console.error("Error initializing demo data:", err);
      } finally {
        // Mark as done regardless of result to prevent hanging
        setInitDone(true);
      }
    };
    
    initDemo();
    
    // Safety timeout to force initialization completion after 500ms
    const safetyTimer = setTimeout(() => {
      if (!initDone) {
        console.log("ResponseForm - Init safety timeout reached");
        setInitDone(true);
      }
    }, 500);
    
    return () => clearTimeout(safetyTimer);
  }, []);
  
  // Start loading state
  useEffect(() => {
    startLoading();
  }, [startLoading]);

  // Get response handlers from the submitter hook
  const { handleSubmit, handleCantMakeIt } = useResponseSubmitter({
    selectedTimeSlots: Array.from(selectedTimeSlots.values()),
    responderName,
    inviteId
  });

  const handleSelectTimeSlot = useCallback((slot: TimeSlot, startTime: string, endTime: string) => {
    setSelectedTimeSlots(prev => {
      const newMap = new Map(prev);
      newMap.set(slot.id, { slot, startTime, endTime });
      return newMap;
    });
  }, []);

  // Handler for when time slots are loaded
  const handleTimeSlotsLoaded = useCallback(() => {
    console.log("TimeSlotLoader signaled slots are loaded");
    finishLoading();
  }, [finishLoading]);
  
  // Force finish loading if we have time slots
  useEffect(() => {
    if (localTimeSlots.length > 0 && isLoading) {
      console.log("Force finishing loading - we have time slots");
      finishLoading();
    }
  }, [localTimeSlots, isLoading, finishLoading]);
  
  // Add final safety timeout - shorter for demo flows
  useEffect(() => {
    const finalSafetyTimer = setTimeout(() => {
      if (isLoading) {
        console.log("ResponseForm - Final safety timeout reached, forcing completion");
        finishLoading();
      }
    }, isDemoId(inviteId || "") ? 800 : 1500);
    
    return () => clearTimeout(finalSafetyTimer);
  }, [isLoading, finishLoading, inviteId]);
  
  // Don't render anything until initialization is complete
  if (!initDone) {
    return <Loading message="Initializing..." subtitle="Setting up your meeting details" />;
  }
  
  return (
    <div className="mb-6">
      {/* This component handles loading time slots */}
      <TimeSlotLoader
        inviteId={inviteId}
        localTimeSlots={localTimeSlots}
        setLocalTimeSlots={setLocalTimeSlots}
        onTimeSlotsLoaded={handleTimeSlotsLoaded}
      />
      
      {/* Show loading state while time slots are being loaded */}
      {isLoading ? (
        <Loading 
          message="Preparing time slots..." 
          subtitle="Just a moment while we get your options ready" 
        />
      ) : localTimeSlots.length === 0 ? (
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
