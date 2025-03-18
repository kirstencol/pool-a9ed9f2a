
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import Loading from "@/components/Loading";
import TimeConfirmationHeader from "@/components/TimeConfirmation/TimeConfirmationHeader";
import ConfirmedTimeSlots from "@/components/TimeConfirmation/ConfirmedTimeSlots";
import ShareableLinks from "@/components/TimeConfirmation/ShareableLinks";

const TimeConfirmation = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    participants, 
    timeSlots, 
    addTimeSlot,
    generateShareableLink,
    storeMeetingInStorage
  } = useMeeting();
  
  const [shareableLink, setShareableLink] = useState("");
  const [inviteId, setInviteId] = useState("");
  const [burtDirectLink, setBurtDirectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set up data when the component loads
  useEffect(() => {
    const setupMeetingData = async () => {
      console.log("TimeConfirmation: Setting up meeting data, time slots:", timeSlots);
      
      if (!currentUser) {
        console.log("No current user, redirecting to home");
        navigate("/");
        return;
      }
      
      // For debugging
      console.log("Current user:", currentUser);
      console.log("TimeConfirmation: Current time slots:", timeSlots.length, "items:", timeSlots);
      console.log("Current participants:", participants);
      
      // If we have time slots, generate shareable link
      if (timeSlots.length > 0) {
        try {
          setIsLoading(true);
          
          // Get the meeting data
          const shareableData = await generateShareableLink();
          setShareableLink(shareableData.url);
          setInviteId(shareableData.id);
          
          // For demo/testing, maintain the burt_demo link
          const baseUrl = window.location.origin;
          setBurtDirectLink(`${baseUrl}/respond/burt_demo`);
          
          // For demo purposes, also store the demo_invite data
          const demoMeetingData = {
            creator: currentUser,
            timeSlots: timeSlots,
          };
          
          await storeMeetingInStorage("demo_invite", demoMeetingData);
          console.log("Stored demo_invite data with time slots:", timeSlots);
          
        } catch (error) {
          console.error("Error generating link:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No time slots found. Redirecting to propose time page");
        navigate("/propose-time");
      }
    };

    setupMeetingData();
  }, [currentUser, navigate, participants, timeSlots, addTimeSlot, generateShareableLink, storeMeetingInStorage]);

  if (!currentUser) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return <Loading message="Preparing your meeting" subtitle="Creating your shareable link..." />;
  }

  // Make sure we display ALL time slots
  console.log("TimeConfirmation: Rendering with time slots:", timeSlots);

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <TimeConfirmationHeader currentUser={currentUser} />
      <ConfirmedTimeSlots timeSlots={timeSlots} currentUserName={currentUser.name} />
      <ShareableLinks 
        shareableLink={shareableLink} 
        burtDirectLink={burtDirectLink}
        inviteId={inviteId}
      />
    </div>
  );
};

export default TimeConfirmation;
