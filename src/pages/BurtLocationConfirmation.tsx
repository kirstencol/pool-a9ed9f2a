
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import TimeSlotCard from "@/components/TimeSlotCard";

interface LocationWithNote {
  name: string;
  note: string;
  selected: boolean;
  userNote: string;
}

const BurtLocationConfirmation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLocationIndex, setSelectedLocationIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Demo data for the meeting time
  const meetingTime = {
    id: "time-1",
    date: "Saturday, March 2nd",
    startTime: "8:00 a.m.",
    endTime: "9:00 a.m.",
    selected: true
  };
  
  // Demo data for Abby and Carrie's location suggestions
  const locationSuggestions: LocationWithNote[] = [
    {
      name: "Central Cafe",
      note: "Suggested by Carrie",
      selected: false,
      userNote: "I like this spot and Abby says they serve great coffee!"
    },
    {
      name: "Starbucks on 5th",
      note: "Suggested by Carrie",
      selected: false,
      userNote: "Convenient location for all of us."
    },
    {
      name: "Park Bistro",
      note: "Suggested by Abby",
      selected: false,
      userNote: "Their breakfast menu is amazing, highly recommend!"
    }
  ];
  
  const handleSelectLocation = (index: number) => {
    setSelectedLocationIndex(index);
  };
  
  const shareableLink = `${window.location.origin}/burt-confirmed`;
  
  const copyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "Share it with your friends",
    });
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleSubmit = () => {
    if (selectedLocationIndex === null) {
      toast({
        title: "Please select a location",
        description: "You need to select a location to proceed",
        variant: "destructive"
      });
      return;
    }
    
    const selectedLocation = locationSuggestions[selectedLocationIndex];
    toast({
      title: "Location confirmed!",
      description: `You've selected ${selectedLocation.name} as the meeting location.`,
    });
    
    navigate("/burt-confirmed", { 
      state: { 
        selectedLocation,
        meetingTime 
      } 
    });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-start mb-6">
        <Avatar initial="B" size="lg" position="second" className="mr-3" />
        <div>
          <h1 className="text-xl font-semibold">Let's confirm a meeting spot!</h1>
          <p className="text-gray-600">Select one of the suggested locations</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="font-medium mb-2">You're meeting:</h2>
        <TimeSlotCard 
          timeSlot={meetingTime}
          selectedByUser
          className="mb-4"
        />
      </div>
      
      <div className="mb-8">
        <h2 className="font-medium mb-4">Location suggestions:</h2>
        <div className="space-y-4">
          {locationSuggestions.map((location, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedLocationIndex === index 
                  ? "bg-purple/10 border-2 border-purple" 
                  : "bg-white border-2 border-gray-100"
              }`}
              onClick={() => handleSelectLocation(index)}
            >
              <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
              <div className="flex items-start mb-3">
                {location.note.includes("Carrie") ? (
                  <Avatar initial="C" size="sm" position="third" className="mr-2 flex-shrink-0" />
                ) : (
                  <Avatar initial="A" size="sm" position="first" className="mr-2 flex-shrink-0" />
                )}
                <p className="text-gray-700 text-sm">{location.userNote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="font-medium mb-4">Share your decision:</h2>
        <div className="flex -space-x-2 mb-4">
          <Avatar initial="A" position="first" className="border-2 border-white" />
          <Avatar initial="C" position="third" className="border-2 border-white" />
        </div>
        
        <div 
          className="border border-gray-300 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-purple-500"
          onClick={copyLink}
        >
          <div className="truncate flex-grow">
            <span className="text-gray-600 text-sm">{shareableLink}</span>
          </div>
          {copied ? (
            <Check className="text-green-500 ml-2" size={20} />
          ) : (
            <Copy className="text-gray-500 ml-2" size={20} />
          )}
        </div>
      </div>
      
      <Button
        onClick={handleSubmit}
        className="w-full bg-purple-light hover:bg-purple-light/90 text-purple-700 flex justify-center items-center"
        disabled={selectedLocationIndex === null}
      >
        Confirm Location <ArrowRight size={16} className="ml-1" />
      </Button>
    </div>
  );
};

export default BurtLocationConfirmation;
