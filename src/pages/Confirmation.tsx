
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import { TimeSlot, UserResponse } from "@/types";
import { 
  ConfirmationHeader, 
  OverlappingTimeSlots, 
  ConfirmationLinks,
  LoadingState,
  FallbackState
} from "@/components/Confirmation";
import { calculateOverlappingTimeSlots } from "@/components/Confirmation/timeUtils";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Try to get the inviteId from location state
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    
    if (inviteId) {
      const fetchMeetingData = async () => {
        try {
          setIsLoading(true);
          const data = await loadMeetingFromStorage(inviteId);
          
          if (data) {
            setMeetingData(data);
            if (data.creator?.name) {
              setCreatorName(data.creator.name || "Abby");
            }
          }
          
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
        } catch (error) {
          console.error("Error loading meeting data:", error);
          setIsLoading(false);
        }
      };
      
      fetchMeetingData();
    }
  }, [location, loadMeetingFromStorage]);

  const handleGoBack = () => {
    // Navigate back to the respond page with the same invitation ID
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    navigate(`/respond/${inviteId}`);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  // If no meeting data is available, show a fallback
  if (!meetingData) {
    return <FallbackState onGoBack={handleGoBack} />;
  }

  // Find time slots with responses
  const timeSlotsWithResponses = meetingData.timeSlots?.filter((slot: TimeSlot) => 
    slot.responses && slot.responses.length > 0
  ) || [];

  // Calculate overlapping availability for each time slot
  const overlappingTimeSlots = calculateOverlappingTimeSlots(timeSlotsWithResponses);

  // Format names for display - fixing the type issue here
  const responderNames: string[] = [...new Set(timeSlotsWithResponses.flatMap((slot: TimeSlot) => 
    (slot.responses || []).map((r: UserResponse) => r.responderName || "")
  ))].filter(Boolean) as string[];
  
  // Display names without the friend labels
  const displayNames = [
    meetingData.creator?.name || "Abby", 
    ...responderNames
  ].filter(Boolean).join(" and ");

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <ConfirmationHeader displayNames={displayNames} />
      
      <OverlappingTimeSlots overlappingTimeSlots={overlappingTimeSlots} />
      
      <ConfirmationLinks 
        meetingId={meetingData?.id || 'demo_invite'} 
        onGoBack={handleGoBack}
        responderNames={responderNames}
      />
    </div>
  );
};

export default Confirmation;
