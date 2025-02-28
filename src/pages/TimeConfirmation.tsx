
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMeeting } from "@/context/MeetingContext";
import { useToast } from "@/hooks/use-toast";

const TimeConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, participants, timeSlots } = useMeeting();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!currentUser || !timeSlots.length) {
      navigate("/");
    }
    // For debugging
    console.log("Current user:", currentUser);
    console.log("Current time slots:", timeSlots);
    console.log("Current participants:", participants);
  }, [currentUser, timeSlots, navigate, participants]);

  if (!currentUser) {
    return null;
  }

  const shareableLink = `${window.location.origin}/respond/12345`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  // Format date for display (e.g., "Thursday, October 25")
  const formatDate = (dateString: string) => {
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return dateString;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
    const day = parseInt(dateParts[2]);
    
    const date = new Date(year, month, day, 12, 0, 0);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center py-6 px-4">
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="status-bar">
          <div className="status-bar-time">7:15</div>
          <div className="status-bar-icons">
            <span>●●●</span>
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold mb-8 mt-8 text-center">You're free:</h1>
        
        <div className="space-y-6 mt-6">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot.id} className="text-center">
              <div className="font-medium">{formatDate(timeSlot.date)}</div>
              <div className="text-gray-600">
                from {timeSlot.startTime} to {timeSlot.endTime}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pb-4">
          <button
            onClick={copyLink}
            className="action-button"
          >
            Copy link to send to friends
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeConfirmation;
