// src/pages/RespondToInvite.tsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { useEffect, useState } from "react";
import InvitationHeader from "@/components/respond/InvitationHeader";
import ResponseForm from "@/components/respond/ResponseForm";
import InvalidInvitation from "@/components/respond/InvalidInvitation";
import Loading from "@/components/Loading";
import { initializeDemoData, getDemoMeetingId } from "@/utils/demo-data";

const RespondToInvite = () => {
  const navigate = useNavigate();
  const { inviteId: rawInviteId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userName = searchParams.get('name') || ""; 
  const currentUserFromStorage = localStorage.getItem('currentUser');
  
  const { loadMeetingFromStorage, timeSlots, isLoading, error } = useMeeting();
  const [responderName, setResponderName] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [loadingState, setLoadingState] = useState<'loading'|'loaded'|'error'>('loading');
  const [meetingId, setMeetingId] = useState<string>("");

  // Initialize data and load meeting
  useEffect(() => {
    const initData = async () => {
      // First ensure demo data exists in Supabase
      await initializeDemoData();
      
      // Process the invite ID
      const inviteId = rawInviteId || "demo_invite";
      
      // For demo scenarios, translate the link ID to an actual meeting ID
      if (inviteId === "demo_invite" || inviteId === "burt_demo" || inviteId === "carrie_demo") {
        const demoId = await getDemoMeetingId(inviteId);
        if (demoId) {
          setMeetingId(demoId);
        } else {
          setLoadingState('error');
          return;
        }
      } else {
        // For real invites, use the ID directly
        setMeetingId(inviteId);
      }
      
      // Only redirect Carrie to CarrieFlow, not Burt
      const effectiveUserName = userName || currentUserFromStorage;
      if (effectiveUserName === "Carrie") {
        navigate(`/carrie-flow?id=${inviteId}`, { replace: true });
        return;
      }
      
      // Load the meeting data
      try {
        const meeting = await loadMeetingFromStorage(meetingId || inviteId);
        if (!meeting) {
          setLoadingState('error');
          return;
        }
        
        // Set creator and responder names
        setCreatorName(meeting.creator?.name || "Abby");
        setResponderName(userName || currentUserFromStorage || "Burt");
        setLoadingState('loaded');
      } catch (err) {
        console.error("Error loading meeting:", err);
        setLoadingState('error');
      }
    };
    
    initData();
  }, [rawInviteId, userName, currentUserFromStorage, loadMeetingFromStorage, navigate]);

  // Show loading state
  if (loadingState === 'loading' || isLoading) {
    return <Loading message="Loading invitation..." subtitle="Please wait while we prepare your time options" />;
  }

  // Show error state
  if (loadingState === 'error' || error || !meetingId) {
    return <InvalidInvitation reason="invalid" />;
  }

  // Make sure we have time slots loaded
  if (!timeSlots || timeSlots.length === 0) {
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
        inviteId={meetingId}
      />
    </div>
  );
};

export default RespondToInvite;
