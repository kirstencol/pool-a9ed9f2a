
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";
import { useToast } from "@/hooks/use-toast";

const TimeConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    currentUser, 
    participants, 
    timeSlots, 
    clearTimeSlots, 
    addTimeSlot,
    generateShareableLink,
    storeMeetingInStorage
  } = useMeeting();
  
  const [copied, setCopied] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [inviteId, setInviteId] = useState("");
  const [burtDirectLink, setBurtDirectLink] = useState("");

  // Set up data when the component loads
  useEffect(() => {
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
    console.log("Current participants:", participants);
    
    // Generate shareable link for this meeting
    if (currentUser && timeSlots.length > 0) {
      // Get the meeting data
      const { id, url } = generateShareableLink();
      setShareableLink(url);
      setInviteId(id);
      
      // For demo/testing, maintain the burt_demo link
      const baseUrl = window.location.origin;
      setBurtDirectLink(`${baseUrl}/respond/burt_demo`);
      
      // For demo purposes, also store the demo_invite data
      const demoMeetingData = {
        creator: currentUser,
        timeSlots: timeSlots,
      };
      
      storeMeetingInStorage("demo_invite", demoMeetingData);
      console.log("Stored demo_invite data with time slots:", timeSlots);
    }
  }, [currentUser, timeSlots, navigate, participants, clearTimeSlots, addTimeSlot, generateShareableLink, storeMeetingInStorage]);

  if (!currentUser) {
    return null;
  }

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };
  
  const copyBurtLink = () => {
    navigator.clipboard.writeText(burtDirectLink);
    setCopied(true);
    toast({
      title: "Burt's direct link copied!",
      description: "This link will take you directly to Burt's response flow",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <Avatar initial={currentUser.initial} position="first" size="lg" className="mr-4" />
        <div>
          <h1 className="text-2xl font-semibold">Perfect, done!</h1>
          <p className="text-gray-600">Let's share your availability.</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">You're free:</h2>
        <div className="space-y-4">
          {timeSlots.map((timeSlot) => (
            <TimeSlotCard 
              key={timeSlot.id} 
              timeSlot={timeSlot} 
              creatorAvailable 
              creatorName={currentUser.name} 
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-xl mb-4 text-center">
          <p className="text-green-700 font-medium">Your meeting data is saved!</p>
          <p className="text-green-600 text-sm">
            Your unique link ID: <span className="font-mono bg-white px-2 py-1 rounded">{inviteId}</span>
          </p>
        </div>
        
        <button
          onClick={copyLink}
          className="action-button w-full"
        >
          Copy link to send to friends
        </button>
        
        <button
          onClick={copyBurtLink}
          className="border border-purple-500 text-purple-500 hover:bg-purple-50 px-4 py-2 rounded-md w-full transition-colors"
        >
          Copy direct link to Burt's view
        </button>
      </div>
    </div>
  );
};

export default TimeConfirmation;
