
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Copy, Link, ChevronLeft } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot, LocationWithNote } from "@/types";
import Avatar from "@/components/Avatar";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [timeConfirmation, setTimeConfirmation] = useState(false);
  const [locationResponses, setLocationResponses] = useState<LocationWithNote[]>([]);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    
    if (inviteId) {
      const data = loadMeetingFromStorage(inviteId);
      if (data) {
        setMeetingData(data);
        
        // Check if this is a time response flow (like burt_demo)
        if (inviteId === 'burt_demo') {
          setTimeConfirmation(true);
        } else {
          // Get location data from state if available (when coming from AbbyLocationResponse)
          const stateLocations = location.state?.selectedLocations;
          if (stateLocations && Array.isArray(stateLocations)) {
            setLocationResponses(stateLocations);
          } else {
            // Fallback to demo data if no state was passed
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
        }
        
        // Simulate loading state
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

  // Helper function to determine if a location was suggested by Abby
  const isAbbySuggestion = (location: LocationWithNote) => {
    return location.note === "Your suggestion";
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="mb-10">
        <h2 className="heading-2 mb-1">Getting together</h2>
        <p className="body-text">{getFormattedDate()} from {getFormattedTime()}</p>
      </div>
      
      {timeConfirmation ? (
        <>
          <p className="mb-6 body-text-bold">You selected these times</p>
          <div className="space-y-6 mb-10">
            {meetingData?.timeSlots?.map((slot: TimeSlot, index: number) => {
              // Only show time slots that have responses from Burt
              const hasBurtResponse = slot.responses?.some(
                (response: any) => response.responderName === "Burt"
              );
              
              if (hasBurtResponse) {
                return (
                  <div key={index} className="bg-purple-light rounded-xl p-4">
                    <h3 className="heading-3 mb-2">{slot.date}</h3>
                    <p className="body-text">{slot.startTime} to {slot.endTime}</p>
                  </div>
                );
              }
              return null;
            })}
          </div>
          
          <p className="mb-4 text-center body-text-bold">Does Carrie need a nudge?</p>
        </>
      ) : (
        <>
          <p className="mb-6 body-text-bold">You and Carrie like these spots</p>
          
          <div className="space-y-6 mb-10">
            {locationResponses.map((location, index) => (
              <div key={index} className="bg-purple-light rounded-xl p-4">
                <h3 className="heading-3 mb-2">{location.name}</h3>
                {!isAbbySuggestion(location) && (
                  <div className="flex items-start mb-3">
                    <Avatar initial="C" size="sm" position="third" className="mr-2 flex-shrink-0" />
                    <p className="small-text">{location.note}</p>
                  </div>
                )}
                <div className="flex items-start">
                  <Avatar initial="A" size="sm" position="first" className="mr-2 flex-shrink-0" />
                  <p className="small-text">{location.userNote}</p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="mb-4 text-center body-text-bold">Does Burt need a nudge?</p>
        </>
      )}
      
      <button
        onClick={copyLink}
        className="w-full py-4 bg-purple-light text-purple-700 rounded-xl flex items-center justify-center mb-8"
      >
        Copy link <Copy className="ml-2 w-5 h-5" />
      </button>
      
      <button
        onClick={handleGoBack}
        className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mx-auto"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Go back</span>
      </button>
    </div>
  );
};

export default Confirmation;
