
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
    clearTimeSlots, 
    addTimeSlot,
    generateShareableLink,
    storeMeetingInStorage
  } = useMeeting();
  
  const [shareableLink, setShareableLink] = useState("");
  const [inviteId, setInviteId] = useState("");
  const [burtDirectLink, setBurtDirectLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timeSlotsLoaded, setTimeSlotsLoaded] = useState(false);

  // Set up data when the component loads
  useEffect(() => {
    const setupMeetingData = async () => {
      console.log("TimeConfirmation: Setting up meeting data, time slots:", timeSlots);
      
      if (!currentUser) {
        console.log("Setting up Abby's data");
        
        // Clear any existing time slots
        clearTimeSlots();
        
        // Add Abby's availability time slots (for demo only)
        const abbyTimeSlots = [
          {
            id: "1",
            date: "March 1",
            startTime: "8:00 AM",
            endTime: "1:30 PM",
            responses: []
          },
          {
            id: "2",
            date: "March 2",
            startTime: "7:00 AM",
            endTime: "10:00 AM",
            responses: []
          },
          {
            id: "3",
            date: "March 3",
            startTime: "9:00 AM",
            endTime: "9:00 PM",
            responses: []
          }
        ];
        
        // This is just for demo, don't add them in the actual flow
        if (timeSlots.length === 0) {
          console.log("No time slots found, adding demo slots");
          for (const slot of abbyTimeSlots) {
            await addTimeSlot(slot);
          }
        }
        
        // Setup Abby as current user if not set
        if (!currentUser) {
          navigate("/");
        }
      }
      
      // For debugging
      console.log("Current user:", currentUser);
      console.log("TimeConfirmation: Current time slots:", timeSlots.length, "items:", timeSlots);
      console.log("Current participants:", participants);
      
      setTimeSlotsLoaded(true);
      
      // Generate shareable link for this meeting
      if (currentUser && timeSlots.length > 0) {
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
      }
    };

    setupMeetingData();
  }, [currentUser, navigate, participants, clearTimeSlots, addTimeSlot, generateShareableLink, storeMeetingInStorage]);

  if (!currentUser) {
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
