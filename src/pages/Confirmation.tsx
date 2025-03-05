
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Copy } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TimeSlotCard from "@/components/TimeSlotCard";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    // Try to get the inviteId from location state
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    
    if (inviteId) {
      const data = loadMeetingFromStorage(inviteId);
      if (data) {
        setMeetingData(data);
        setCreatorName(data.creator?.name || "Friend A");
      }
    }
  }, [location, loadMeetingFromStorage]);

  const copyLink = () => {
    // Generate a shareable link
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/respond/${meetingData?.id || 'demo_invite'}`;
    
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  // If no meeting data is available, show a fallback
  if (!meetingData) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
        <div className="celebration-animation">
          <Check className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6">Your response has been saved!</h1>
        <p className="text-center text-gray-600 mb-8">Thanks for letting us know when you're free.</p>
      </div>
    );
  }

  // Find the matching times between creator and responder
  const matchingTimes = meetingData.timeSlots?.filter((slot: any) => 
    slot.responses && slot.responses.length > 0
  ) || [];

  // Format names for display
  const responderNames = [...new Set(matchingTimes.flatMap((slot: any) => 
    slot.responses?.map((r: any) => r.name) || []
  ))];
  
  const displayNames = [meetingData.creator?.name || "Friend A", ...responderNames]
    .filter(Boolean)
    .join(" and ");

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <div className="celebration-animation">
        <Check className="text-white" size={32} />
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-6">
        {displayNames} are both free...
      </h1>
      
      <div className="space-y-6 mb-10">
        {matchingTimes.map((timeSlot: any) => (
          <div key={timeSlot.id} className="space-y-1">
            <h2 className="text-xl font-medium">
              {timeSlot.date}
            </h2>
            <p className="text-lg">
              {timeSlot.startTime} - {timeSlot.endTime}
            </p>
          </div>
        ))}
      </div>
      
      {responderNames.length < 2 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">
            Does {responderNames.length === 0 ? "anyone" : "Sam"} need a nudge?
          </h2>
        </div>
      )}
      
      <Button 
        onClick={copyLink}
        className="w-full py-8 text-lg gap-3"
        variant="secondary"
      >
        Copy link
        <Copy className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default Confirmation;
