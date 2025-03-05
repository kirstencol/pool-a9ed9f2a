
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Copy, ChevronLeft, Sparkles } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types";

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const inviteId = searchParams.get('id') || 'demo_invite';
    
    if (inviteId) {
      const data = loadMeetingFromStorage(inviteId);
      if (data) {
        setMeetingData(data);
        
        // Simulate loading state
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } else {
        setIsLoading(false);
      }
    }
  }, [location, loadMeetingFromStorage]);

  const getSelectedTimeSlots = () => {
    if (meetingData?.timeSlots) {
      return meetingData.timeSlots.filter((slot: TimeSlot) => 
        slot.responses?.some((response: any) => response.responderName === "Burt")
      );
    }
    return [];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "March 1";
    
    try {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "8:00 AM - 1:30 PM";
    return `${startTime} - ${endTime}`;
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
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  const selectedTimeSlots = getSelectedTimeSlots();

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-purple-light flex items-center justify-center">
          <Sparkles className="text-purple-700 w-10 h-10" />
        </div>
      </div>
      
      <h1 className="text-center text-2xl font-semibold mb-12">
        Abby and Burt are both free...
      </h1>
      
      <div className="space-y-6 mb-16">
        {selectedTimeSlots.length > 0 ? (
          selectedTimeSlots.map((slot: TimeSlot, index: number) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">{formatDate(slot.date)}</h3>
              <p className="text-lg">{formatTimeRange(slot.startTime, slot.endTime)}</p>
            </div>
          ))
        ) : (
          // Fallback to demo data if no selected time slots
          <>
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">March 1</h3>
              <p className="text-lg">8:00 AM - 1:30 PM</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-2">March 2</h3>
              <p className="text-lg">7:00 AM - 10:00 AM</p>
            </div>
          </>
        )}
      </div>
      
      <p className="text-center text-xl font-medium mb-8">
        Does Carrie need a nudge?
      </p>
      
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
