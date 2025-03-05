
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import TimeSelector from "@/components/TimeSelector";
import { format } from "date-fns";

const CarrieTimeConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  
  const inviteId = searchParams.get("id") || "carrie_demo";
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  
  const [selectedStartTime, setSelectedStartTime] = useState(startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(endTime);
  
  const { currentUser } = useMeeting();

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return dateString;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    try {
      const date = new Date(year, month, day);
      return format(date, "EEEE, MMMM d");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleContinue = () => {
    if (selectedStartTime && selectedEndTime) {
      navigate(`/carrie-select-location?id=${inviteId}&date=${date}&startTime=${selectedStartTime}&endTime=${selectedEndTime}`);
    } else {
      toast({
        title: "Please select a time",
        variant: "destructive"
      });
    }
  };

  const handleStartTimeChange = (newTime: string) => {
    setSelectedStartTime(newTime);
  };

  const handleEndTimeChange = (newTime: string) => {
    setSelectedEndTime(newTime);
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

      <h1 className="text-2xl font-semibold mb-2">Good news! This day works for everyone.</h1>
      <p className="text-gray-600 mb-6">Confirm the time:</p>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="font-medium text-lg mb-1">{formatDate(date)}</h2>
        <p className="text-gray-700 mb-4">Everyone's free {startTime} - {endTime}</p>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-center text-gray-700 mb-3">Adjust the time if needed:</p>
          <div className="flex justify-center space-x-4 items-center">
            <TimeSelector 
              time={selectedStartTime} 
              onTimeChange={handleStartTimeChange}
            />
            <span className="text-gray-500">to</span>
            <TimeSelector 
              time={selectedEndTime} 
              onTimeChange={handleEndTimeChange}
              isEndTime={true}
              startTime={selectedStartTime}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
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
