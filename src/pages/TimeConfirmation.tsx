
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

  // Set up data when the component loads
  useEffect(() => {
    const setupMeetingData = async () => {
      console.log("Setting up meeting data, time slots:", timeSlots);
      
      if (!currentUser) {
        console.log("Setting up Abby's data");
        
        // Clear any existing time slots
        clearTimeSlots();
        
        // Add Abby's availability time slots
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
        
        abbyTimeSlots.forEach(slot => {
          addTimeSlot(slot);
        });
        
        // Setup Abby as current user if not set
        if (!currentUser) {
          navigate("/");
        }
      }
      
      // For debugging
      console.log("Current user:", currentUser);
      console.log("Current time slots:", timeSlots);
      console.log("Number of time slots:", timeSlots.length);
      console.log("Current participants:", participants);
      
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
  }, [currentUser, timeSlots, navigate, participants, clearTimeSlots, addTimeSlot, generateShareableLink, storeMeetingInStorage]);

  if (!currentUser) {
    return null;
  }

  if (isLoading) {
    return <Loading message="Preparing your meeting" subtitle="Creating your shareable link..." />;
  }

  // Make sure we display ALL time slots
  console.log("Displaying time slots:", timeSlots);

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
