
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Sparkles, Copy, Link, ChevronLeft, ArrowRight, MapPin, Plus } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";
import { convertTimeToMinutes } from "@/utils/timeUtils";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage, storeMeetingInStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [creatorName, setCreatorName] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("60");
  const [showLocationSuggestion, setShowLocationSuggestion] = useState(false);
  const [suggestedLocations, setSuggestedLocations] = useState<{ name: string; note: string }[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationNote, setNewLocationNote] = useState("");
  const [finalMeetingTime, setFinalMeetingTime] = useState<{date: string; startTime: string; endTime: string} | null>(null);
  
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

  const handleTimeSlotSelection = (timeSlot: any) => {
    setSelectedTimeSlot(timeSlot.id);
    setFinalMeetingTime({
      date: timeSlot.date,
      startTime: timeSlot.overlapStartTime,
      endTime: calculateEndTime(timeSlot.overlapStartTime, selectedDuration)
    });
  };

  const calculateEndTime = (startTime: string, durationMinutes: string) => {
    // Convert start time to minutes since midnight
    const startMinutes = convertTimeToMinutes(startTime);
    
    // Add duration
    const endMinutes = startMinutes + parseInt(durationMinutes);
    
    // Convert back to time format
    return formatMinutesToTime(endMinutes);
  };

  const handleContinueToLocation = () => {
    if (!selectedTimeSlot || !finalMeetingTime) {
      toast({
        title: "Please select a time",
        description: "Select one of the available time slots to continue",
        variant: "destructive"
      });
      return;
    }
    
    setShowLocationSuggestion(true);
  };

  const handleAddLocation = () => {
    if (!newLocationName.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for the location",
        variant: "destructive"
      });
      return;
    }
    
    setSuggestedLocations([
      ...suggestedLocations, 
      { 
        name: newLocationName,
        note: newLocationNote
      }
    ]);
    
    setNewLocationName("");
    setNewLocationNote("");
  };

  const handleSendSuggestions = () => {
    if (suggestedLocations.length === 0) {
      toast({
        title: "No locations suggested",
        description: "Please suggest at least one location",
        variant: "destructive"
      });
      return;
    }
    
    // Here we would normally send this data to the backend
    // For now, we'll just show a success message
    toast({
      title: "Suggestions sent!",
      description: "Your location suggestions have been sent",
    });
    
    // Navigate to a confirmation page or reset the form
    setShowLocationSuggestion(false);
    setSelectedTimeSlot(null);
    setSuggestedLocations([]);
  };

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

  // Check if current user is Carrie based on URL params
  const searchParams = new URLSearchParams(location.search);
  const inviteId = searchParams.get('id') || "";
  const isCarrieFlow = inviteId === "carrie_demo";

  // If this is Carrie's flow and we have location suggestions, show the location suggestion UI
  if (isCarrieFlow && showLocationSuggestion) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <Avatar initial="S" className="mx-auto mb-4" size="lg" />
          <h1 className="text-2xl font-semibold text-center">Almost done!</h1>
          <p className="text-center mt-2">Suggest a spot to meet:</p>
        </div>
        
        <div className="mb-6">
          <p className="text-lg font-medium">
            {finalMeetingTime?.date} from {finalMeetingTime?.startTime} to {finalMeetingTime?.endTime}
          </p>
        </div>

        {/* Location suggestion form */}
        <div className="border border-gray-300 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-4">
            <MapPin className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Enter place name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="w-full focus:outline-none"
            />
          </div>
          
          <textarea
            placeholder="Add a note (optional)"
            value={newLocationNote}
            onChange={(e) => setNewLocationNote(e.target.value)}
            className="w-full h-20 border-t border-gray-200 pt-4 focus:outline-none resize-none"
          />
        </div>

        {/* Display suggested locations */}
        {suggestedLocations.length > 0 && (
          <div className="space-y-4 mb-6">
            {suggestedLocations.map((location, index) => (
              <div key={index} className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="text-gray-400 mr-2" />
                  <h3 className="font-medium">{location.name}</h3>
                </div>
                {location.note && <p className="text-gray-700">{location.note}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Add another location button */}
        <button
          onClick={handleAddLocation}
          className="w-full border border-dashed border-gray-300 rounded-lg py-4 px-4 flex items-center justify-center text-gray-500 mb-6"
        >
          <Plus className="w-4 h-4 mr-2" /> add another option
        </button>

        {/* Submit button */}
        <button
          onClick={handleSendSuggestions}
          className="w-full bg-purple-200 text-purple-800 py-4 rounded-lg flex items-center justify-center"
        >
          Send suggestions <ArrowRight className="ml-2 w-5 h-5" />
        </button>

        {/* Go back button */}
        <button
          onClick={() => setShowLocationSuggestion(false)}
          className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mt-6 mx-auto"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          <span>Go back to time selection</span>
        </button>
      </div>
    );
  }

  // For Carrie's flow, show the time selection UI
  if (isCarrieFlow && overlappingTimeSlots.length > 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="mb-8">
          <Avatar initial="S" className="mx-auto mb-4" size="lg" />
          <h1 className="text-2xl font-semibold text-center">Good news! Two times work for everyone.</h1>
          <p className="text-center mt-2">Take your pick:</p>
        </div>

        <div className="space-y-4 mb-8">
          {overlappingTimeSlots.map((timeSlot: any) => (
            <button
              key={timeSlot.id}
              onClick={() => handleTimeSlotSelection(timeSlot)}
              className={`w-full p-4 rounded-xl text-left transition-all ${
                selectedTimeSlot === timeSlot.id 
                  ? "bg-purple/10 border-2 border-purple" 
                  : "border-2 border-gray-100"
              }`}
            >
              <h3 className="text-xl font-medium mb-1">
                {timeSlot.date}
              </h3>
              <p className="text-lg">
                Everyone's free {timeSlot.overlapStartTime} - {timeSlot.overlapEndTime}
              </p>
            </button>
          ))}
        </div>

        {selectedTimeSlot && (
          <div className="mb-8">
            <label className="block text-sm font-medium mb-2">
              How long do you need?
            </label>
            <select
              value={selectedDuration}
              onChange={(e) => {
                setSelectedDuration(e.target.value);
                
                const selected = overlappingTimeSlots.find((ts: any) => ts.id === selectedTimeSlot);
                if (selected) {
                  setFinalMeetingTime({
                    date: selected.date,
                    startTime: selected.overlapStartTime,
                    endTime: calculateEndTime(selected.overlapStartTime, e.target.value)
                  });
                }
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        )}

        <button
          onClick={handleContinueToLocation}
          className="action-button"
          disabled={!selectedTimeSlot}
        >
          Continue <ArrowRight className="ml-2" size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
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
          className="action-button"
        >
          Copy link to send to friends
          {copied ? <Check className="w-5 h-5" /> : <Link className="w-5 h-5" />}
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
