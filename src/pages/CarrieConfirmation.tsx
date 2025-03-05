
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Check, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMeeting } from "@/context/meeting";
import Avatar from "@/components/Avatar";

type LocationWithNote = {
  name: string;
  note: string;
};

const CarrieConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  const locationParam = searchParams.get("location") || "";
  const locDataParam = searchParams.get("locData") || "";
  
  const [copied, setCopied] = useState(false);
  const [locations, setLocations] = useState<LocationWithNote[]>([]);
  
  useEffect(() => {
    // Try to parse the location data JSON
    if (locDataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(locDataParam));
        setLocations(decodedData);
      } catch (e) {
        // Fallback to simple locations if JSON parsing fails
        const basicLocations = locationParam.split(",").map((loc, index) => ({ 
          name: loc.trim(),
          note: ""
        }));
        setLocations(basicLocations);
      }
    } else {
      // Fallback to simple locations if no JSON data
      const basicLocations = locationParam.split(",").map((loc, index) => ({ 
        name: loc.trim(),
        note: ""
      }));
      setLocations(basicLocations);
    }
  }, [locDataParam, locationParam]);
  
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

      <h1 className="text-xl font-semibold text-center mb-2">Almost done!</h1>
      <p className="text-gray-600 text-center mb-4">Suggest a spot to meet:</p>
      
      <div className="bg-purple-50 rounded-lg p-4 mb-6 text-center">
        <p className="text-gray-700">
          {formatDate(date)} from {startTime} to {endTime}
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {locations.map((loc, index) => (
          <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-gray-400" />
              <p className="font-medium text-gray-800">{loc.name}</p>
            </div>
            {loc.note && (
              <p className="text-sm text-gray-500">{loc.note}</p>
            )}
          </div>
        ))}
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
            Copy link to get input from friends
          </>
        )}
      </Button>
    </div>
  );
};

export default CarrieConfirmation;
