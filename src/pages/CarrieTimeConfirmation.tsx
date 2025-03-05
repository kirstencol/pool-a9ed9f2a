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
  const { currentUser, setCurrentUser } = useMeeting();
  
  const searchParams = new URLSearchParams(location.search);
  
  const inviteId = searchParams.get("id") || "carrie_demo";
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  
  // Use the hook to get invite data
  const { isLoading } = useInviteData(inviteId, "Carrie");
  
  const [adjustedStartTime, setAdjustedStartTime] = useState(startTime);
  const [adjustedEndTime, setAdjustedEndTime] = useState(endTime);

  useEffect(() => {
    // Initialize with passed times
    setAdjustedStartTime(startTime);
    setAdjustedEndTime(endTime);
    
    // Force set Carrie as the current user in localStorage and context
    localStorage.setItem('currentUser', 'Carrie');
    if (!currentUser || currentUser.name !== 'Carrie') {
      setCurrentUser({
        id: "carrie-id",
        name: "Carrie",
        initial: "C"
      });
    }
    
    console.log("CarrieTimeConfirmation - Current path:", location.pathname);
    console.log("CarrieTimeConfirmation - Params:", { inviteId, date, startTime, endTime });
  }, [startTime, endTime, currentUser, setCurrentUser, location.pathname]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return dateString;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    const dateObj = new Date(year, month, day, 12, 0, 0);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return dateObj.toLocaleDateString('en-US', options);
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

  const formattedDate = formatDate(date);

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 mb-6"
      >
        <ArrowLeft size={16} className="mr-1" />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-6">It's Happening!</h1>
      <p className="text-gray-600 mb-6">
        Abby, Burt, and Carrie are getting together
      </p>

      <div className="bg-purple-50 rounded-lg p-6 mb-8 border border-purple-100">
        <div className="space-y-3">
          <p className="font-medium">{formattedDate}</p>
          <p className="font-medium">{adjustedStartTime} - {adjustedEndTime}</p>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleContinue}
          size="icon"
          className="rounded-full h-10 w-10"
        >
          <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default CarrieTimeConfirmation;
