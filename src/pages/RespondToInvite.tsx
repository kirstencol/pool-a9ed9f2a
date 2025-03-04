import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMeeting } from "@/context/MeetingContext";
import { useInviteData } from "@/hooks/useInviteData";
import InvitationHeader from "@/components/respond/InvitationHeader";
import ResponseForm from "@/components/respond/ResponseForm";
import InvalidInvitation from "@/components/respond/InvalidInvitation";

const RespondToInvite = () => {
  const { inviteId } = useParams();
  const { timeSlots } = useMeeting();
  
  const {
    isLoading,
    inviteError,
    creatorName,
    responderName
  } = useInviteData(inviteId);

  useEffect(() => {
    // Debug logging to track when timeSlots changes
    console.log("timeSlots updated:", timeSlots);
  }, [timeSlots]);

  if (isLoading) {
    return <InvalidInvitation reason="loading" />;
  }

  if (inviteError) {
    return <InvalidInvitation reason={inviteError} />;
  }

  // Make sure we have time slots loaded
  if (!timeSlots || timeSlots.length === 0) {
    console.log("No time slots found for invite:", inviteId);
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
