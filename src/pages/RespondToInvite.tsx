
// src/pages/RespondToInvite.tsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { useEffect, useState } from "react";
import InvitationHeader from "@/components/respond/InvitationHeader";
import ResponseForm from "@/components/respond/ResponseForm";
import InvalidInvitation from "@/components/respond/InvalidInvitation";
import Loading from "@/components/Loading";
import { initializeDemoData } from "@/context/meeting/storage";

const RespondToInvite = () => {
  const navigate = useNavigate();
  const { inviteId: rawInviteId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userName = searchParams.get('name') || ""; 
  const currentUserFromStorage = localStorage.getItem('currentUser');
  
  const { loadMeetingFromStorage, timeSlots, isLoading, error, addTimeSlotsBatch } = useMeeting();
  const [responderName, setResponderName] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [loadingState, setLoadingState] = useState<'loading'|'loaded'|'error'>('loading');
  const [inviteId, setInviteId] = useState<string>("");

  // Initialize data and load meeting
  useEffect(() => {
    const initData = async () => {
      // Initialize demo data
      initializeDemoData();
      
      // Process the invite ID
      const effectiveInviteId = rawInviteId || "demo_invite";
      setInviteId(effectiveInviteId);
      
      // Only redirect Carrie to CarrieFlow, not Burt
      const effectiveUserName = userName || currentUserFromStorage;
      if (effectiveUserName === "Carrie") {
        console.log("Redirecting Carrie to CarrieFlow");
        navigate(`/carrie-flow?id=${effectiveInviteId}`, { replace: true });
        return;
      }
      
      // Load the meeting data
      try {
        const meeting = await loadMeetingFromStorage(effectiveInviteId);
        console.log("RespondToInvite - Loaded meeting data:", meeting);
        
        if (!meeting && ["demo_invite", "burt_demo", "carrie_demo"].includes(effectiveInviteId)) {
          // For demo IDs, create mock data if loading failed
          console.log("Creating mock meeting data for demo:", effectiveInviteId);
          
          // Set mock time slots using addTimeSlotsBatch
          const mockTimeSlots = [
            {
              id: "mock1",
              date: "March 15",
              startTime: "3:00 PM",
              endTime: "5:00 PM",
              responses: []
            },
            {
              id: "mock2",
              date: "March 16",
              startTime: "2:00 PM",
              endTime: "4:00 PM",
              responses: []
            }
          ];
          
          // We'll add the time slots to the local state in the ResponseForm component
          setCreatorName("Abby");
          setResponderName(userName || currentUserFromStorage || 
                         (effectiveInviteId === "burt_demo" ? "Burt" : "Carrie"));
          setLoadingState('loaded');
          return;
        }
        
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
        
        // For demo IDs, create mock data if loading failed
        if (["demo_invite", "burt_demo", "carrie_demo"].includes(effectiveInviteId)) {
          console.log("Creating mock data after error for demo:", effectiveInviteId);
          
          // We'll add the mock time slots to local state in ResponseForm instead
          setCreatorName("Abby");
          setResponderName(userName || currentUserFromStorage || 
                         (effectiveInviteId === "burt_demo" ? "Burt" : "Carrie"));
          setLoadingState('loaded');
          return;
        }
        
        setLoadingState('error');
      }
    };
    
    initData();
  }, [rawInviteId, userName, currentUserFromStorage, loadMeetingFromStorage, navigate, addTimeSlotsBatch]);

  // Show loading state
  if (loadingState === 'loading' || isLoading) {
    return <Loading message="Loading invitation..." subtitle="Please wait while we prepare your time options" />;
  }

  // Show error state
  if (loadingState === 'error' || error) {
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
