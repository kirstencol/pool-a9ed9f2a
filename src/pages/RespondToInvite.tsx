
import { useParams } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { useInviteData } from "@/hooks/useInviteData";
import { useEffect, useRef, useState } from "react";
import InvitationHeader from "@/components/respond/InvitationHeader";
import ResponseForm from "@/components/respond/ResponseForm";
import InvalidInvitation from "@/components/respond/InvalidInvitation";
import { initializeDemoData } from "@/context/meeting/storage";
import Loading from "@/components/Loading";

const RespondToInvite = () => {
  const { inviteId: rawInviteId } = useParams();
  const inviteId = rawInviteId || "demo_invite"; // Fallback to demo_invite if no ID provided
  const { timeSlots: contextTimeSlots } = useMeeting();
  const initialLoadComplete = useRef(false);
  const [forcedError, setForcedError] = useState<'invalid' | null>(null);
  
  // Initialize demo data on component mount
  useEffect(() => {
    if (!initialLoadComplete.current) {
      // This ensures demo data is available immediately when component loads
      initializeDemoData();
      console.log("RespondToInvite - Initialized demo data on mount");
      initialLoadComplete.current = true;
    }
  }, []);
  
  // Add a safety timeout to prevent infinite loading
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      console.log("RespondToInvite - Safety timeout reached, forcing error state");
      setForcedError('invalid');
    }, 10000); // Extended to 10 seconds to avoid premature errors
    
    return () => {
      clearTimeout(safetyTimer);
    };
  }, []);
  
  console.log("RespondToInvite - Received inviteId param:", rawInviteId);
  console.log("RespondToInvite - Using inviteId:", inviteId);
  console.log("RespondToInvite - Initial contextTimeSlots:", contextTimeSlots);
  
  const {
    isLoading,
    inviteError,
    creatorName,
    responderName,
    inviteTimeSlots
  } = useInviteData(inviteId);

  console.log("RespondToInvite - Data from hook:", {
    isLoading,
    inviteError,
    creatorName,
    responderName,
    inviteTimeSlots,
    contextTimeSlots
  });

  // Handle loading state with better feedback
  if (isLoading && !forcedError) {
    console.log("RespondToInvite - Still loading...");
    return <Loading message="Loading invitation..." subtitle="Please wait while we prepare your time options" />;
  }

  // Only show error if BOTH inviteError is set AND we don't have time slots
  // This prevents flashing an error when we actually have valid data
  if ((inviteError || forcedError) && (!inviteTimeSlots || inviteTimeSlots.length === 0)) {
    const errorReason = inviteError || forcedError;
    console.log("RespondToInvite - Error:", errorReason);
    return <InvalidInvitation reason={errorReason} />;
  }

  // Make sure we have time slots loaded - checking our local copy from the hook
  console.log("RespondToInvite - Checking inviteTimeSlots:", { 
    inviteTimeSlots, 
    inviteTimeSlotsLength: inviteTimeSlots?.length || 0
  });
  
  // Let's try to continue with any data we have
  // Only show error if we truly have no data at all
  if (!inviteTimeSlots || inviteTimeSlots.length === 0) {
    console.log("RespondToInvite - No inviteTimeSlots found for invite:", inviteId);
    return <InvalidInvitation reason="invalid" />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <InvitationHeader 
        creatorName={creatorName} 
        responderName={responderName} 
      />

      <ResponseForm
        creatorName={creatorName}
        responderName={responderName}
        inviteId={inviteId}
      />
    </div>
  );
};

export default RespondToInvite;
