
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
  }, [currentUser, timeSlots, navigate]);

  if (!currentUser) {
    return null;
  }

  const shareableLink = `${window.location.origin}/respond/12345`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  // Create a string of participant names for the share message
  const participantNames = participants.map(p => p.name).join(" & ");

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
            <TimeSlotCard key={timeSlot.id} timeSlot={timeSlot} creatorAvailable />
          ))}
        </div>
      </div>

      <button
        onClick={copyLink}
        className="action-button"
      >
        Copy link to send to {participantNames}
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default TimeConfirmation;
