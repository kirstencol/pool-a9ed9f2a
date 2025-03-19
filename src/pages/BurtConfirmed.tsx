
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";
import { Check } from "lucide-react";
import Loading from "@/components/Loading";
import { useLoadingState } from "@/hooks/useLoadingState";

const BurtConfirmed = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteId = searchParams.get('id') || 'burt_demo';
  
  const { loadMeetingFromStorage } = useMeeting();
  const { isLoading, startLoading, finishLoading } = useLoadingState({
    minimumLoadingTime: 500,
    safetyTimeoutDuration: 2000
  });
  
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingStartTime, setMeetingStartTime] = useState("");
  const [meetingEndTime, setMeetingEndTime] = useState("");

  useEffect(() => {
    const loadMeetingData = async () => {
      // Start loading
      startLoading();
      
      try {
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
        // Mark loading as finished - the hook will enforce minimum display time
        finishLoading();
      }
    };
    
    loadMeetingData();
  }, [inviteId, loadMeetingFromStorage, startLoading, finishLoading]);

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
