import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Copy, Link, ChevronLeft } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot, LocationWithNote } from "@/types";
import { convertTimeToMinutes } from "@/utils/timeUtils";
import Avatar from "@/components/Avatar";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [locationResponses, setLocationResponses] = useState<LocationWithNote[]>([]);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    
    if (inviteId) {
      const data = loadMeetingFromStorage(inviteId);
      if (data) {
        setMeetingData(data);
        
        const stateLocations = location.state?.selectedLocations;
        if (stateLocations && Array.isArray(stateLocations)) {
          setLocationResponses(stateLocations);
        } else {
          setLocationResponses([
            { 
              name: "Central Cafe", 
              note: "Great coffee and shouldn't be too hard to get a table.",
              selected: true,
              userNote: "I like this place."
            },
            { 
              name: "Starbucks on 5th", 
              note: "Not the best vibes, but central to all three of us. Plus, PSLs.",
              selected: true,
              userNote: "Okay, if we must."
            }
          ]);
        }
        
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else {
        setIsLoading(false);
      }
    }
  }, [location, loadMeetingFromStorage]);

  const getFormattedDate = () => {
    if (meetingData?.timeSlots?.[0]?.date) {
      return meetingData.timeSlots[0].date;
    }
    return "Saturday, March 2nd";
  };

  const getFormattedTime = () => {
    if (meetingData?.timeSlots?.[0]) {
      const slot = meetingData.timeSlots[0];
      return `${slot.startTime} to ${slot.endTime}`;
    }
    return "8:00 a.m. to 9:00 a.m.";
  };

  const copyLink = () => {
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
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-6 animate-pulse">
            <span className="text-gray-500">waiting animation</span>
          </div>
        </div>
      </div>
    );
  }

  const isAbbySuggestion = (location: LocationWithNote) => {
    return location.note === "Your suggestion";
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-1">Getting together</h2>
        <p className="text-gray-700">{getFormattedDate()} from {getFormattedTime()}</p>
      </div>
      
      <p className="mb-6 text-gray-700 font-medium">You and Carrie like these spots</p>
      
      <div className="space-y-6 mb-10">
        {locationResponses.map((location, index) => (
          <div key={index} className="bg-purple-light rounded-xl p-4">
            <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
            {!isAbbySuggestion(location) && (
              <div className="flex items-start mb-3">
                <Avatar initial="C" size="sm" position="third" className="mr-2 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{location.note}</p>
              </div>
            )}
            <div className="flex items-start">
              <Avatar initial="A" size="sm" position="first" className="mr-2 flex-shrink-0" />
              <p className="text-gray-700 text-sm">{location.userNote}</p>
            </div>
          </div>
        ))}
      </div>
      
      <p className="mb-4 text-center text-gray-700 font-medium">Does Burt need a nudge?</p>
      
      <Button
        onClick={copyLink}
        variant="purpleOutline"
        className="w-full py-4 mb-8 flex items-center justify-center"
      >
        Copy link <Copy className="ml-2 w-5 h-5" />
      </Button>
      
      <Button
        onClick={handleGoBack}
        variant="ghost"
        className="flex mx-auto items-center justify-center text-gray-500 hover:text-gray-700 h-auto p-0"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Go back</span>
      </Button>
    </div>
  );
};

export default Confirmation;
