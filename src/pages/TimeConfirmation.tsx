
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";
import { useToast } from "@/hooks/use-toast";

const TimeConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, participants, timeSlots } = useMeeting();
  const [copied, setCopied] = useState(false);

  if (!currentUser || !timeSlots.length) {
    navigate("/");
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

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <Avatar initial={currentUser.initial} size="lg" className="mr-4" />
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

      <div className="mb-8">
        <h2 className="font-medium mb-4">Share with your friends:</h2>
        <div className="flex -space-x-2 mb-4">
          {participants.map((participant) => (
            <Avatar 
              key={participant.id} 
              initial={participant.initial}
              className="border-2 border-white" 
            />
          ))}
        </div>
        
        <div 
          className="border border-gray-300 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-purple-500"
          onClick={copyLink}
        >
          <div className="truncate flex-grow">
            <span className="text-gray-600 text-sm">{shareableLink}</span>
          </div>
          {copied ? (
            <Check className="text-green-500 ml-2" size={20} />
          ) : (
            <Copy className="text-gray-500 ml-2" size={20} />
          )}
        </div>
      </div>

      <button
        onClick={() => navigate("/respond/12345")}
        className="action-button"
      >
        Preview link
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default TimeConfirmation;
