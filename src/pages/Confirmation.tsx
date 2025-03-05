
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Sparkles, Copy, Link, ChevronLeft } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";
import { convertTimeToMinutes } from "@/utils/timeUtils";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [copied, setCopied] = useState(false);
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

  const copyLink = () => {
    // Generate a shareable link
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/select-user?id=${meetingData?.id || 'demo_invite'}`;
    
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleGoBack = () => {
    // Navigate back to the respond page with the same invitation ID
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    navigate(`/respond/${inviteId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6 animate-pulse">
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // If no meeting data is available, show a fallback
  if (!meetingData) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="celebration-animation">
          <Check className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-semibold text-center mb-6">Your response has been saved!</h1>
        <p className="text-center text-gray-600 mb-8">Thanks for letting us know when you're free.</p>
        
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mt-8 mx-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Oops, go back</span>
        </button>
      </div>
    );
  }

  // Find time slots with responses
  const timeSlotsWithResponses = meetingData.timeSlots?.filter((slot: TimeSlot) => 
    slot.responses && slot.responses.length > 0
  ) || [];

  // Calculate overlapping availability for each time slot
  const overlappingTimeSlots = timeSlotsWithResponses.map((slot: TimeSlot) => {
    // Start with creator's full availability
    let overlapStartMinutes = convertTimeToMinutes(slot.startTime);
    let overlapEndMinutes = convertTimeToMinutes(slot.endTime);
    
    // Adjust based on each response
    slot.responses.forEach(response => {
      const responseStartMinutes = convertTimeToMinutes(response.startTime || "");
      const responseEndMinutes = convertTimeToMinutes(response.endTime || "");
      
      if (responseStartMinutes && responseEndMinutes) {
        // Update overlap to be the later start time
        overlapStartMinutes = Math.max(overlapStartMinutes, responseStartMinutes);
        
        // Update overlap to be the earlier end time
        overlapEndMinutes = Math.min(overlapEndMinutes, responseEndMinutes);
      }
    });
    
    // Only include slots where there's still a valid overlap
    if (overlapStartMinutes < overlapEndMinutes) {
      return {
        ...slot,
        overlapStartTime: formatMinutesToTime(overlapStartMinutes),
        overlapEndTime: formatMinutesToTime(overlapEndMinutes)
      };
    }
    return null;
  }).filter(Boolean);

  // Format minutes back to time string (e.g., "9:30 AM")
  function formatMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  // Format names for display
  const responderNames = [...new Set(timeSlotsWithResponses.flatMap((slot: TimeSlot) => 
    slot.responses?.map((r: any) => r.responderName as string) || []
  ))];
  
  // Display names without the friend labels
  const displayNames = [
    meetingData.creator?.name || "Abby", 
    ...responderNames
  ].filter(Boolean).join(" and ");

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fade-in">
      <div className="celebration-animation">
        <Sparkles className="text-purple" size={32} />
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-6">
        {displayNames} are both free...
      </h1>
      
      <div className="space-y-6 mb-10">
        {overlappingTimeSlots.map((timeSlot: any) => (
          <div key={timeSlot.id} className="space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-medium">
              {timeSlot.date}
            </h2>
            <p className="text-lg">
              {timeSlot.overlapStartTime} - {timeSlot.overlapEndTime}
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
                ? "Does Carrie need a nudge?" 
                : "Does Burt need a nudge?"}
          </h2>
        </div>
      )}

      <div className="space-y-4">
        <div className="p-4 bg-green-50 rounded-xl mb-4 text-center">
          <p className="text-green-700 font-medium">Your meeting data is saved!</p>
          <p className="text-green-600 text-sm">
            Your unique link ID: <span className="font-mono bg-white px-2 py-1 rounded">{meetingData?.id || 'demo_invite'}</span>
          </p>
        </div>
        
        <button
          onClick={copyLink}
          className="action-button w-full py-4 bg-purple-light text-purple-700 rounded-xl flex items-center justify-center"
        >
          Copy link to send to friends
          {copied ? <Check className="w-5 h-5 ml-2" /> : <Link className="w-5 h-5 ml-2" />}
        </button>
        
        <button
          onClick={handleGoBack}
          className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors w-full mt-6"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Oops, go back</span>
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
