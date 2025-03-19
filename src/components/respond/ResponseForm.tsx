
import { useState, useEffect, useCallback, useRef } from "react";
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
  const [initDone, setInitDone] = useState(false);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const initAttemptedRef = useRef(false);
  
  // Use a shorter minimum loading time to reduce flickering
  const { isLoading, finishLoading, startLoading } = useLoadingState({
    minimumLoadingTime: 600,
    safetyTimeoutDuration: 5000 // Increased for better reliability
  });
  
  // Initialize demo data on component mount - with useCallback to prevent recreations
  const initializeDemoDataOnce = useCallback(async () => {
    if (!initDone && !initAttemptedRef.current) {
      try {
        // Set flag immediately to prevent multiple attempts
        initAttemptedRef.current = true;
        console.log("ResponseForm - Starting demo data initialization");
        
        await initializeDemoData();
        console.log("ResponseForm - Initialized demo data on mount");
        setInitDone(true);
      } catch (error) {
        console.error("Error initializing demo data:", error);
        // Still mark as initialized to prevent hanging
        setInitDone(true);
      }
    }
  }, [initDone]);

  useEffect(() => {
    startLoading(); // Explicitly start loading state
    
    // Add a slight delay before initialization to reduce concurrent rendering
    const timer = setTimeout(() => {
      initializeDemoDataOnce();
    }, 20);
    
    return () => clearTimeout(timer);
  }, [initializeDemoDataOnce, startLoading]);

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
    console.log("Selected time slot:", slot, startTime, endTime);
  }, []);

  // Memoize the time slots loaded flag to prevent unnecessary re-renders
  const timeSlotsLoaded = localTimeSlots.length > 0;
  
  // Add a useEffect to detect when loading is finished
  useEffect(() => {
    if (hasAttemptedLoad && timeSlotsLoaded) {
      console.log("Time slots loaded, finishing loading state");
      const timer = setTimeout(() => {
        finishLoading();
      }, 100); // Short delay to reduce state transition jitter
      
      return () => clearTimeout(timer);
    }
  }, [hasAttemptedLoad, timeSlotsLoaded, finishLoading]);
  
  // Don't render anything until initialization is complete
  if (!initDone) {
    return <Loading message="Initializing..." subtitle="Setting up your meeting details" delay={150} />;
  }
  
  return (
    <div className="mb-6">
      {/* This component handles loading time slots */}
      <TimeSlotLoader
        inviteId={inviteId}
        localTimeSlots={localTimeSlots}
        setLocalTimeSlots={setLocalTimeSlots}
        onTimeSlotsLoaded={() => {
          console.log("TimeSlotLoader signaled slots are loaded");
          setHasAttemptedLoad(true);
          if (timeSlotsLoaded) {
            // Add a slight delay before finishing loading
            setTimeout(() => {
              finishLoading();
            }, 200);
          }
        }}
      />
      
      {/* Show loading state while time slots are being loaded */}
      {isLoading ? (
        <Loading 
          message="Preparing time slots..." 
          subtitle="Just a moment while we get your options ready" 
          delay={200} // Slightly longer delay for smoother transition
        />
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
