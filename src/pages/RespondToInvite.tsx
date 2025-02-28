
import { useParams } from "react-router-dom";
import { useMeeting } from "@/context/MeetingContext";
import LoadingInvite from "@/components/respond/LoadingInvite";
import InvalidInvite from "@/components/respond/InvalidInvite";
import InviteResponseForm from "@/components/respond/InviteResponseForm";
import { useInviteData } from "@/hooks/useInviteData";

const RespondToInvite = () => {
  const { inviteId } = useParams();
  const { timeSlots } = useMeeting();
  const { isLoading, creatorName, responderName } = useInviteData(inviteId);

  // If we're still loading data, show a loading state
  if (isLoading) {
    return <LoadingInvite />;
  }

  if (!timeSlots.length) {
    return <InvalidInvite />;
  }

  return (
    <InviteResponseForm
      creatorName={creatorName}
      responderName={responderName}
      timeSlots={timeSlots}
    />
  );
};

export default RespondToInvite;
