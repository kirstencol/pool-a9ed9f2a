
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";

const CarrieConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  const meetingLocation = searchParams.get("location") || "";

  const { currentUser } = useMeeting();

  const handleShareClick = () => {
    // In a real app, this would generate a shareable link
    toast({
      title: "Meetup confirmed!",
      description: "Notification sent to Abby and Burt"
    });
  };

  const handleAddToCalendar = () => {
    toast({
      title: "Added to calendar",
      description: "Event has been added to your calendar"
    });
    
    // Redirect to home after a short delay
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-2">All set!</h1>
      <p className="text-gray-600 mb-6">You've confirmed the meetup details.</p>

      <div className="bg-purple-50 rounded-lg p-6 mb-8 border border-purple-100">
        <h2 className="font-medium mb-4">Meetup Details:</h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{date}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{startTime} - {endTime}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{meetingLocation}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Attendees</p>
            <p className="font-medium">Abby, Burt, and {currentUser?.name || "Carrie"}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          variant="default"
          className="w-full flex items-center justify-center"
          onClick={handleShareClick}
        >
          <Share size={16} className="mr-2" />
          Confirm and Share
        </Button>
        
        <Button
          variant="outline"
          className="w-full flex items-center justify-center"
          onClick={handleAddToCalendar}
        >
          <Calendar size={16} className="mr-2" />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
};

export default CarrieConfirmation;
