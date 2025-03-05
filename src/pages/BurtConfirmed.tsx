import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { useMeeting } from "@/context/meeting";
import { TimeSlot } from "@/types";

const BurtConfirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingData, setMeetingData] = useState<any>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("8:00 a.m. to 9:00 a.m.");
  const [selectedDate, setSelectedDate] = useState<string>("Saturday, March 2nd");
  
  const { selectedLocations } = location.state || { selectedLocations: [] };
  
  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        const data = await loadMeetingFromStorage("burt_demo");
        if (data) {
          setMeetingData(data);
          
          const burtSlot = data.timeSlots?.find((slot: any) => 
            slot.responses?.some((resp: any) => resp.responderName === "Burt")
          );
          
          if (burtSlot) {
            setTimeSlot(burtSlot);
            
            const burtResponse = burtSlot.responses?.find((resp: any) => resp.responderName === "Burt");
            
            if (burtResponse) {
              setSelectedTimeRange(`${burtResponse.startTime} to ${burtResponse.endTime}`);
            }
            
            const formattedDate = formatDate(burtSlot.date);
            if (formattedDate) {
              setSelectedDate(formattedDate);
            }
          }
        }
      } catch (error) {
        console.error("Error loading Burt's meeting data:", error);
      }
    };
    
    fetchMeetingData();
  }, [loadMeetingFromStorage]);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "Saturday, March 2nd";
    
    try {
      if (dateString.includes("-")) {
        const [year, month, day] = dateString.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric',
          year: undefined
        }) + (day === 1 || day === 21 || day === 31 ? "st" : 
               day === 2 || day === 22 ? "nd" : 
               day === 3 || day === 23 ? "rd" : "th");
      } else if (dateString.includes(" ")) {
        const parts = dateString.split(" ");
        const month = parts[0];
        const day = parseInt(parts[1]);
        
        const monthIndex = ["January", "February", "March", "April", "May", "June", 
                           "July", "August", "September", "October", "November", "December"]
                           .findIndex(m => m.toLowerCase() === month.toLowerCase());
        
        if (monthIndex >= 0) {
          const dateObj = new Date(2024, monthIndex, day);
          const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
          const ordinal = day === 1 || day === 21 || day === 31 ? "st" : 
                          day === 2 || day === 22 ? "nd" : 
                          day === 3 || day === 23 ? "rd" : "th";
          
          return `${weekday}, ${month} ${day}${ordinal}`;
        }
      }
      
      return dateString;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Saturday, March 2nd";
    }
  };
  
  if (!selectedLocations || selectedLocations.length === 0) {
    navigate("/");
    return null;
  }
  
  const finalLocation = selectedLocations[0];
  
  const handleAddToCalendar = () => {
    navigate("/add-to-calendar");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-start">
        <Avatar initial="B" size="lg" position="second" className="mr-3" />
        <div>
          <h1 className="text-2xl font-semibold mb-1">Confirmed!</h1>
          <p className="text-gray-600">You're all set.</p>
        </div>
      </div>
      
      <div className="my-6 p-6 bg-white rounded-xl border border-gray-200">
        <h2 className="font-semibold mb-2">Getting together</h2>
        <p className="text-gray-700 mb-4">{selectedDate} from {selectedTimeRange}</p>
        
        <h2 className="font-semibold mb-2">Location</h2>
        <p className="text-gray-700">{finalLocation.name}</p>
        
        {finalLocation.note && finalLocation.note !== "Your suggestion" && (
          <div className="flex items-start mt-3">
            <Avatar 
              initial="C" 
              size="sm" 
              position="third" 
              className="mr-2" 
            />
            <p className="text-sm text-gray-600">{finalLocation.note}</p>
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
            <p className="text-sm text-gray-600">{finalLocation.abbyComment}</p>
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
            <p className="text-sm text-gray-600">{finalLocation.userNote}</p>
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
