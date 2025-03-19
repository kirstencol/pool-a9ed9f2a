
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";
import { Check } from "lucide-react";
import Loading from "@/components/Loading";

const BurtConfirmed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get('id') || 'burt_demo';
  
  const { loadMeetingFromStorage } = useMeeting();
  
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState("");
  const [meetingEndTime, setMeetingEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAttempted, setLoadingAttempted] = useState(false);

  useEffect(() => {
    const loadMeetingData = async () => {
      if (loadingAttempted) return;
      setLoadingAttempted(true);
      
      try {
        setIsLoading(true);
        console.log("BurtConfirmed: Loading meeting data for:", inviteId);
        const meetingData = await loadMeetingFromStorage(inviteId);
        
        if (meetingData && meetingData.timeSlots && meetingData.timeSlots.length > 0) {
          // Use the first time slot for demonstration purposes
          const timeSlot = meetingData.timeSlots[0];
          setMeetingDate(timeSlot.date);
          setMeetingStartTime(timeSlot.startTime);
          setMeetingEndTime(timeSlot.endTime);
          console.log("BurtConfirmed: Successfully loaded time slot data");
        } else {
          console.log("BurtConfirmed: No time slots found, using fallback data");
          // Fallback values if no data is found
          setMeetingDate("March 1");
          setMeetingStartTime("9:00 AM");
          setMeetingEndTime("10:30 AM");
        }
      } catch (error) {
        console.error("Error loading meeting data:", error);
        // Fallback values if error occurs
        setMeetingDate("March 1");
        setMeetingStartTime("9:00 AM");
        setMeetingEndTime("10:30 AM");
      } finally {
        // Add a small delay to prevent flickering
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };
    
    loadMeetingData();
    
    // Safety timeout to prevent perpetual loading
    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.log("BurtConfirmed: Safety timeout reached, ending loading state");
        setIsLoading(false);
        
        // Set fallback data if needed
        if (!meetingDate) {
          setMeetingDate("March 1");
          setMeetingStartTime("9:00 AM");
          setMeetingEndTime("10:30 AM");
        }
      }
    }, 2000);
    
    return () => clearTimeout(safetyTimeout);
  }, [inviteId, loadMeetingFromStorage, isLoading, loadingAttempted, meetingDate]);

  if (isLoading) {
    return <Loading message="Loading confirmation" subtitle="Just a moment..." />;
  }

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <div className="celebration-animation">
          <Check className="text-white" size={32} />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-semibold">Thanks, Burt!</h1>
          <p className="text-gray-600">Your availability is confirmed.</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl mb-8">
        <p className="text-gray-600 mb-2">You're available:</p>
        <p className="font-medium text-lg">{meetingDate}</p>
        <p className="font-medium text-lg">{meetingStartTime} - {meetingEndTime}</p>
      </div>

      <div className="mb-8">
        <p className="text-gray-600 mb-2">Attending:</p>
        <div className="flex items-center">
          <Avatar initial="A" className="mr-2" />
          <span className="font-medium">Abby</span>
        </div>
        <div className="flex items-center mt-2">
          <Avatar initial="B" className="mr-2" />
          <span className="font-medium">Burt (you)</span>
        </div>
        <div className="flex items-center mt-2 opacity-50">
          <Avatar initial="C" className="mr-2" />
          <span className="font-medium">Carrie (waiting for response)</span>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-gray-600">Abby will share location options soon!</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="secondary-button"
      >
        Back to home
      </button>
    </div>
  );
};

export default BurtConfirmed;
