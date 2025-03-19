
// src/pages/RespondToInvite.tsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { useEffect, useState, useCallback } from "react";
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
  
  const { loadMeetingFromStorage, isLoading: contextLoading, error } = useMeeting();
  const [responderName, setResponderName] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [loadingState, setLoadingState] = useState<'loading'|'loaded'|'error'>('loading');
  const [inviteId, setInviteId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize demo data first
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDemoData();
        console.log("RespondToInvite - Demo data initialized");
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing demo data:", error);
        // Still mark as initialized to prevent hanging
        setIsInitialized(true);
      }
    };
    
    initialize();
  }, []);

  // Define loadData function with useCallback to prevent recreation
  const loadData = useCallback(async () => {
    if (!isInitialized) return;
    
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
      console.log("RespondToInvite - Loading meeting data for:", effectiveInviteId);
      const meeting = await loadMeetingFromStorage(effectiveInviteId);
      console.log("RespondToInvite - Loaded meeting data:", meeting);
      
      if (!meeting && ["demo_invite", "burt_demo", "carrie_demo"].includes(effectiveInviteId)) {
        // For demo IDs, create mock data if loading failed
        console.log("Creating mock meeting data for demo:", effectiveInviteId);
        
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
        
        setCreatorName("Abby");
        setResponderName(userName || currentUserFromStorage || 
                      (effectiveInviteId === "burt_demo" ? "Burt" : "Carrie"));
        setLoadingState('loaded');
        return;
      }
      
      setLoadingState('error');
    }
  }, [rawInviteId, userName, currentUserFromStorage, loadMeetingFromStorage, navigate, isInitialized]);

  // After initialization, load meeting data
  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized, loadData]);

  // Show loading state
  if (loadingState === 'loading' || contextLoading || !isInitialized) {
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
