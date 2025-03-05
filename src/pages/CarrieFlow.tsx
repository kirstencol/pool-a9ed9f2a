import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";
import { convertTimeToMinutes } from "@/utils/timeUtils";
import TimeSelection from "@/components/carrie/TimeSelection";
import LocationProposal from "@/components/location/LocationProposal";
import Loading from "@/components/Loading";
import { initializeDemoData } from "@/context/meeting/storage";
import Avatar from "@/components/Avatar";

interface Location {
  name: string;
  note: string;
}

interface OverlapTimeSlot extends TimeSlot {
  overlapStartTime: string;
  overlapEndTime: string;
}

interface FinalizedMeeting {
  date: string;
  startTime: string;
  endTime: string;
  locations: Location[];
}

const CarrieFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage, storeMeetingInStorage } = useMeeting();
  
  const [loading, setLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<any>(null);
  const [overlappingTimeSlots, setOverlappingTimeSlots] = useState<OverlapTimeSlot[]>([]);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [finalizedMeeting, setFinalizedMeeting] = useState<FinalizedMeeting | null>(null);
  const [meetingComplete, setMeetingComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize demo data
    initializeDemoData();
    
    // Load meeting data from storage
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'carrie_demo';
    
    setTimeout(() => {
      const data = loadMeetingFromStorage(inviteId);
      if (data && data.timeSlots) {
        setMeetingData(data);
        
        // Calculate overlapping time slots
        const processedTimeSlots = calculateOverlappingTimeSlots(data.timeSlots);
        console.log("CarrieFlow - Processed overlapping time slots:", processedTimeSlots);
        setOverlappingTimeSlots(processedTimeSlots);
        
        setLoading(false);
      } else {
        setError("Could not load meeting data");
        setLoading(false);
      }
    }, 1000); // Simulate loading
  }, [loadMeetingFromStorage, location.search]);

  const calculateOverlappingTimeSlots = (timeSlots: TimeSlot[]): OverlapTimeSlot[] => {
    // Find time slots with responses
    const timeSlotsWithResponses = timeSlots?.filter((slot) => 
      slot.responses && slot.responses.length > 0
    ) || [];

    // Calculate overlapping availability for each time slot
    return timeSlotsWithResponses.map((slot) => {
      // Start with creator's full availability
      let overlapStartMinutes = convertTimeToMinutes(slot.startTime);
      let overlapEndMinutes = convertTimeToMinutes(slot.endTime);
      
      // Adjust based on each response
      slot.responses?.forEach(response => {
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
    }).filter(Boolean) as OverlapTimeSlot[];
  };

  // Format minutes back to time string (e.g., "9:30 AM")
  function formatMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
  }

  const handleTimeSelected = (selectedSlot: OverlapTimeSlot, durationMinutes: number) => {
    // Calculate end time based on start time and duration
    const startMinutes = convertTimeToMinutes(selectedSlot.overlapStartTime);
    const endMinutes = startMinutes + durationMinutes;
    const endTime = formatMinutesToTime(endMinutes);
    
    // Set finalized meeting details
    setFinalizedMeeting({
      date: selectedSlot.date,
      startTime: selectedSlot.overlapStartTime,
      endTime: endTime,
      locations: []
    });
    
    // Show location selector
    setShowLocationSelector(true);
  };

  const handleGoBackToTimeSelection = () => {
    setShowLocationSelector(false);
  };

  const handleLocationsSubmitted = (locations: Location[]) => {
    if (!finalizedMeeting) return;
    
    // Update finalized meeting with locations
    const updatedMeeting = {
      ...finalizedMeeting,
      locations
    };
    
    setFinalizedMeeting(updatedMeeting);
    setMeetingComplete(true);
    
    // Save to storage if needed
    // storeMeetingInStorage...
    
    // Show success message
    toast({
      title: "Meeting arranged!",
      description: "Your location suggestions have been sent to everyone",
    });
    
    // Delay to show the success state
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  // Show loading state
  if (loading) {
    return <Loading message="Loading meeting availability..." subtitle="Checking when everyone is free" />;
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => navigate("/")}
          className="text-blue-500 hover:underline"
        >
          Go back to home
        </button>
      </div>
    );
  }

  // Show meeting complete state
  if (meetingComplete && finalizedMeeting) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="celebration-animation">
          <Sparkles className="text-purple" size={32} />
        </div>
        
        <h1 className="text-2xl font-semibold text-center mb-6">
          You're getting together
        </h1>
        
        <p className="text-xl text-center mb-8">
          {finalizedMeeting.date} from {finalizedMeeting.startTime} to {finalizedMeeting.endTime}
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-100 text-blue-800 py-3 rounded-lg"
        >
          Add to calendar
        </button>
      </div>
    );
  }

  // Show location suggestion view
  if (showLocationSelector && finalizedMeeting) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <LocationProposal
          meetingDate={finalizedMeeting.date}
          startTime={finalizedMeeting.startTime}
          endTime={finalizedMeeting.endTime}
          onGoBack={handleGoBackToTimeSelection}
          onSubmit={handleLocationsSubmitted}
        />
      </div>
    );
  }

  // Show time selection view (default)
  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <TimeSelection
        timeSlots={overlappingTimeSlots}
        onContinue={handleTimeSelected}
      />
    </div>
  );
};

export default CarrieFlow;
