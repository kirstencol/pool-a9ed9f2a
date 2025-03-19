
// src/pages/RespondToInvite.tsx
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { useEffect, useState, useCallback, useRef } from "react";
import InvitationHeader from "@/components/respond/InvitationHeader";
import ResponseForm from "@/components/respond/ResponseForm";
import InvalidInvitation from "@/components/respond/InvalidInvitation";
import Loading from "@/components/Loading";
import { initializeDemoData } from "@/context/meeting/storage";
import { isDemoId } from "@/context/meeting/storage/demoData";

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
  const initAttemptedRef = useRef(false);
  const didMountRef = useRef(false);
  
  // Initialize demo data and process invite ID immediately on mount
  useEffect(() => {
    if (didMountRef.current) return;
    didMountRef.current = true;
    
    const initialize = async () => {
      try {
        if (initAttemptedRef.current) return;
        initAttemptedRef.current = true;
        
        // Immediately process invite ID
        const effectiveInviteId = rawInviteId || "demo_invite";
        setInviteId(effectiveInviteId);
        
        // For demo invites, set up creator/responder names immediately
        if (isDemoId(effectiveInviteId)) {
          setCreatorName("Abby");
          
          // Override responder name for specific demo IDs
          if (effectiveInviteId === "burt_demo") {
            setResponderName("Burt");
          } else if (effectiveInviteId === "carrie_demo") {
            setResponderName("Carrie");
          } else {
            // Use passed name parameter or the stored name
            setResponderName(userName || currentUserFromStorage || "Burt");
          }
        }
        
        await initializeDemoData();
        console.log("RespondToInvite - Demo data initialized");
        setIsInitialized(true);
        
        // For demo IDs, move to loaded state immediately
        if (isDemoId(effectiveInviteId)) {
          console.log("RespondToInvite - Demo ID, moving to loaded state immediately");
          setLoadingState('loaded');
        }
      } catch (error) {
        console.error("Error initializing demo data:", error);
        // Still mark as initialized to prevent hanging
        setIsInitialized(true);
        setLoadingState('loaded'); // Force loaded state even on error for demo
      }
    };
    
    // Start initialization immediately
    initialize();
    
    // Set a safety timeout to force completion after 800ms
    const loadingTimeoutRef = setTimeout(() => {
      console.log("RespondToInvite - Safety timeout reached, forcing completion");
      setIsInitialized(true);
      setLoadingState('loaded');
    }, 800);
    
    return () => clearTimeout(loadingTimeoutRef);
  }, [rawInviteId, userName, currentUserFromStorage]);

  // Define loadData function with useCallback to prevent recreation
  const loadData = useCallback(async () => {
    if (!isInitialized) return;
    
    // Process the invite ID
    const effectiveInviteId = inviteId || rawInviteId || "demo_invite";
    
    // Only redirect Carrie to CarrieFlow, not Burt
    if (responderName === "Carrie" || userName === "Carrie") {
      console.log("Redirecting Carrie to CarrieFlow");
      navigate(`/carrie-flow?id=${effectiveInviteId}`, { replace: true });
      return;
    }
    
    // For demo IDs, create mock data immediately if not already done
    if (isDemoId(effectiveInviteId) && loadingState === 'loading') {
      console.log("Creating immediate mock data for demo:", effectiveInviteId);
      
      // Set creator and responder names based on demo ID
      setCreatorName("Abby");
      
      if (effectiveInviteId === "burt_demo") {
        setResponderName("Burt");
      } else if (effectiveInviteId === "carrie_demo") {
        setResponderName("Carrie");
      } else {
        setResponderName(userName || currentUserFromStorage || "Burt");
      }
      
      // Move to loaded state
      setLoadingState('loaded');
      return;
    }
    
    // For non-demo IDs, load the meeting data
    if (loadingState === 'loading' && !isDemoId(effectiveInviteId)) {
      try {
        console.log("RespondToInvite - Loading meeting data for:", effectiveInviteId);
        const meeting = await loadMeetingFromStorage(effectiveInviteId);
        
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
    }
  }, [rawInviteId, userName, currentUserFromStorage, loadMeetingFromStorage, navigate, isInitialized, inviteId, loadingState, responderName]);

  // After initialization, load meeting data
  useEffect(() => {
    if (isInitialized) {
      loadData();
    }
  }, [isInitialized, loadData]);

  // Final safety timeout - shorter for better UX
  useEffect(() => {
    const finalTimeout = setTimeout(() => {
      if (loadingState === 'loading') {
        console.log("Final safety timeout reached, forcing loaded state");
        setLoadingState('loaded');
      }
    }, 1000);
    
    return () => clearTimeout(finalTimeout);
  }, [loadingState]);

  // Show loading state
  if (loadingState === 'loading' || contextLoading) {
    return <Loading 
      message="Loading invitation..." 
      subtitle="Please wait while we prepare your time options" 
    />;
  }

  // Show error state
  if (loadingState === 'error' || error) {
    return <InvalidInvitation reason="invalid" />;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
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
