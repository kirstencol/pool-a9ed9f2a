
import { useParams } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { useInviteData } from "@/hooks/useInviteData";
import InvitationHeader from "@/components/respond/InvitationHeader";
import ResponseForm from "@/components/respond/ResponseForm";
import InvalidInvitation from "@/components/respond/InvalidInvitation";

const RespondToInvite = () => {
  const { inviteId: rawInviteId } = useParams();
  const inviteId = rawInviteId || "demo_invite"; // Fallback to demo_invite if no ID provided
  const { timeSlots: contextTimeSlots } = useMeeting();
  
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

  if (isLoading) {
    console.log("RespondToInvite - Still loading...");
    return <InvalidInvitation reason="loading" />;
  }

  if (inviteError) {
    console.log("RespondToInvite - Error:", inviteError);
    return <InvalidInvitation reason={inviteError} />;
  }

  // Make sure we have time slots loaded - checking our local copy from the hook
  console.log("RespondToInvite - Checking inviteTimeSlots:", { 
    inviteTimeSlots, 
    inviteTimeSlotsLength: inviteTimeSlots?.length || 0
  });
  
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
