
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";
import { useToast } from "@/hooks/use-toast";

const TimeConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, participants, timeSlots } = useMeeting();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentUser || !timeSlots.length) {
      navigate("/");
    }
    // For debugging
    console.log("Current user:", currentUser);
    console.log("Current time slots:", timeSlots);
    console.log("Current participants:", participants);
  }, [currentUser, timeSlots, navigate, participants]);

  if (!currentUser) {
    return null;
  }

  // Generate a real invite ID - in a real app, this would be stored in a database
  // For demo purposes, we'll create a random ID based on the current timestamp
  const inviteId = `inv_${Date.now().toString(36)}`;
  const shareableLink = `${window.location.origin}/respond/${inviteId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
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

      <button
        onClick={copyLink}
        className="action-button"
      >
        Copy link to send to friends
      </button>
    </div>
  );
};

export default TimeConfirmation;
