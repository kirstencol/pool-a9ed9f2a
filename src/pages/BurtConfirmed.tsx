
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { useMeeting } from "@/context/meeting";

const BurtConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const { selectedLocations } = location.state || { selectedLocations: [] };
  
  useEffect(() => {
    // Load meeting data to get time information
    const data = loadMeetingFromStorage("burt_demo");
    if (data) {
      setMeetingData(data);
    }
  }, [loadMeetingFromStorage]);
  
  if (!selectedLocations || selectedLocations.length === 0) {
    navigate("/");
    return null;
  }
  
  // Just use the first selected location for the demo
  const finalLocation = selectedLocations[0];
  
  // Get date and time from meetingData if available, otherwise use defaults
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
  
  const handleAddToCalendar = () => {
    navigate("/add-to-calendar");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-start">
        <Avatar initial="B" size="lg" position="second" className="mr-3" />
        <div>
          <h1 className="heading-2 mb-1">Confirmed!</h1>
          <p className="body-text">You're all set.</p>
        </div>
      </div>
      
      <div className="my-6 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="heading-3 mb-2">Getting together</h2>
        <p className="body-text mb-4">{getFormattedDate()} from {getFormattedTime()}</p>
        
        <h2 className="heading-3 mb-2">Location</h2>
        <p className="body-text">{finalLocation.name}</p>
        
        {finalLocation.note && finalLocation.note !== "Your suggestion" && (
          <div className="flex items-start mt-3">
            <Avatar 
              initial="C" 
              size="sm" 
              position="third" 
              className="mr-2" 
            />
            <p className="small-text">{finalLocation.note}</p>
          </div>
        )}
        
        {finalLocation.abbyComment && (
          <div className="flex items-start mt-3">
            <Avatar 
              initial="A" 
              size="sm" 
              position="first" 
              className="mr-2" 
            />
            <p className="small-text">{finalLocation.abbyComment}</p>
          </div>
        )}
        
        {finalLocation.userNote && (
          <div className="flex items-start mt-3">
            <Avatar 
              initial="B" 
              size="sm" 
              position="second" 
              className="mr-2" 
            />
            <p className="small-text">{finalLocation.userNote}</p>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleAddToCalendar} 
        className="w-full py-5 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
      >
        <CalendarPlus size={20} />
        Add to Calendar
      </Button>
    </div>
  );
};

export default BurtConfirmed;
