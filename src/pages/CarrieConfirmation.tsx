
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";

const CarrieConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  const locationParam = searchParams.get("location") || "";
  
  // Parse location data from the URL parameter
  const locations = locationParam.split(",").map((loc, index) => ({ 
    name: loc.trim(),
    id: index.toString() 
  }));
  
  const { currentUser } = useMeeting();
  const [copied, setCopied] = useState(false);

  // Format the date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const dateParts = dateString.split('-');
    if (dateParts.length !== 3) return dateString;
    
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const day = parseInt(dateParts[2]);
    
    const dateObj = new Date(year, month, day);
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric'
    };
    
    return dateObj.toLocaleDateString('en-US', options);
  };

  const handleCopyLink = () => {
    // Create a shareable link with the meetup details
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/respond?date=${date}&startTime=${startTime}&endTime=${endTime}&locations=${encodeURIComponent(locationParam)}`;
    
    navigator.clipboard.writeText(shareableUrl).then(() => {
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it with Abby and Burt to get their input"
      });
      
      // Reset the copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000);
    });
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

      <div className="flex justify-center mb-4">
        <Avatar initial="C" size="lg" position="third" />
      </div>

      <h1 className="text-2xl font-semibold mb-2">Ready to share!</h1>
      <p className="text-gray-600 mb-6">Let Abby and Burt know your location suggestions.</p>

      <div className="bg-purple-50 rounded-lg p-6 mb-8 border border-purple-100">
        <h2 className="font-medium mb-4">Meetup Details:</h2>
        
        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{formatDate(date)}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium">{startTime} - {endTime}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Suggested Locations</p>
            <div className="space-y-2 mt-1">
              {locations.map((loc) => (
                <div key={loc.id} className="bg-white p-3 rounded-md">
                  <p className="font-medium">{loc.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="default"
        className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700"
        onClick={handleCopyLink}
      >
        {copied ? (
          <>
            <Check size={16} className="mr-2" />
            Copied!
          </>
        ) : (
          <>
            <Copy size={16} className="mr-2" />
            Copy link to share with friends
          </>
        )}
      </Button>
    </div>
  );
};

export default CarrieConfirmation;
