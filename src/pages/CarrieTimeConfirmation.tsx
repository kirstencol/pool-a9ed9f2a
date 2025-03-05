
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import { useInviteData } from "@/hooks/useInviteData";

const CarrieTimeConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { currentUser } = useMeeting();
  
  const searchParams = new URLSearchParams(location.search);
  
  const inviteId = searchParams.get("id") || "carrie_demo";
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  
  // Use the same hook to get invite data
  const { creatorName, responderName, inviteTimeSlots, isLoading } = useInviteData(inviteId, "Carrie");
  
  // For duration selection
  const [meetingDuration, setMeetingDuration] = useState("60"); // Default 60 minutes
  const [adjustedStartTime, setAdjustedStartTime] = useState(startTime);
  const [adjustedEndTime, setAdjustedEndTime] = useState(endTime);

  useEffect(() => {
    // Initialize with passed times
    setAdjustedStartTime(startTime);
    setAdjustedEndTime(endTime);
  }, [startTime, endTime]);

  const handleTimeChange = (start: string, end: string) => {
    setAdjustedStartTime(start);
    setAdjustedEndTime(end);
  };

  const handleContinue = () => {
    toast({
      title: "Time selected!",
      description: "Moving on to location selection"
    });
    
    navigate(`/carrie-select-location?id=${inviteId}&date=${date}&startTime=${adjustedStartTime}&endTime=${adjustedEndTime}`);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">Good news!</h1>
      <p className="text-gray-600 mb-6">This day works for everyone!</p>

      <div className="bg-purple-50 rounded-lg p-6 mb-8 border border-purple-100">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{date}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{adjustedStartTime} - {adjustedEndTime}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Attendees</p>
            <p className="font-medium">Abby, Burt, and {responderName}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="font-medium mb-3">Meeting duration:</h2>
        <div className="flex space-x-2">
          {["30", "45", "60", "90"].map((duration) => (
            <Button
              key={duration}
              variant={meetingDuration === duration ? "default" : "outline"}
              onClick={() => setMeetingDuration(duration)}
              className="flex-1"
            >
              {duration} min
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleContinue}
          className="flex items-center"
        >
          Continue
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CarrieTimeConfirmation;
