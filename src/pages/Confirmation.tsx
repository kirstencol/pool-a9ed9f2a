
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Sparkles } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);
  
  useEffect(() => {
    // Try to get the inviteId from location state
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    
    if (inviteId) {
      const data = loadMeetingFromStorage(inviteId);
      if (data) {
        setMeetingData(data);
        setCreatorName(data.creator?.name || "Abby");
      }
    }

    // Hide celebration after 3 seconds
    const timeout = setTimeout(() => {
      setShowCelebration(false);
    }, 3000);

    return () => clearTimeout(timeout);
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
    slot.responses?.map((r: any) => r.responderName) || []
  ))];
  
  // Add friend labels to names
  const getFriendLabel = (name: string) => {
    switch(name) {
      case "Abby": return "Abby (Friend A)";
      case "Burt": return "Burt (Friend B)";
      case "Carrie": return "Carrie (Friend C)";
      default: return name;
    }
  };
  
  const labeledNames = [
    getFriendLabel(meetingData.creator?.name || "Abby"), 
    ...responderNames.map(name => getFriendLabel(name))
  ].filter(Boolean);
  
  const displayNames = labeledNames.join(" and ");

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-celebration" style={{ 
            transform: "scale(2.5)",
            animation: "celebration 1.5s ease-out forwards"
          }}>
            <Sparkles className="text-purple h-16 w-16" />
          </div>
        </div>
      )}
      
      <div className="celebration-animation bg-purple/20">
        <Check className="text-purple" size={32} />
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-6">
        {displayNames} are both free...
      </h1>
      
      <div className="space-y-6 mb-10">
        {matchingTimes.map((timeSlot: any) => (
          <div key={timeSlot.id} className="space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
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
        <div className="mb-8 text-center">
          <h2 className="text-lg font-medium mb-2">
            {responderNames.length === 0 
              ? "Does anyone need a nudge?" 
              : responderNames[0] === "Burt" 
                ? "Does Carrie (Friend C) need a nudge?" 
                : "Does Burt (Friend B) need a nudge?"}
          </h2>
        </div>
      )}
      
      <Button 
        onClick={copyLink}
        className="w-full py-6 text-lg gap-3"
        variant="secondary"
      >
        Copy link
        {copied ? <Check className="w-5 h-5" /> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>}
      </Button>
    </div>
  );
};

export default Confirmation;
