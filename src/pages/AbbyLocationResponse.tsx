
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";

type LocationWithNote = {
  name: string;
  note: string;
};

const AbbyLocationResponse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Demo data for Sam's location suggestions
  const [locations] = useState<LocationWithNote[]>([
    { 
      name: "Central Cafe", 
      note: "Great coffee and shouldn't be too hard to get a table." 
    },
    { 
      name: "Starbucks on 5th", 
      note: "Not the best vibes, but central to all three of us. Plus, PSLs." 
    }
  ]);
  
  // Display date and time hardcoded for the demo
  const date = "Friday October 25";
  const timeRange = "2 to 3 pm";
  
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasDifferentIdea, setHasDifferentIdea] = useState(false);
  const [differentIdeaText, setDifferentIdeaText] = useState("");
  
  const handleSelectOption = (locationName: string) => {
    setSelectedOption(locationName);
    setHasDifferentIdea(false);
  };
  
  const handleDifferentIdea = () => {
    setSelectedOption(null);
    setHasDifferentIdea(true);
  };
  
  const handleSubmit = () => {
    if (selectedOption) {
      toast({
        title: "Response submitted!",
        description: `You selected: ${selectedOption}`
      });
    } else if (hasDifferentIdea && differentIdeaText) {
      toast({
        title: "Response submitted!",
        description: `You suggested: ${differentIdeaText}`
      });
    } else {
      toast({
        title: "Please make a selection",
        description: "Select a location or suggest your own",
        variant: "destructive"
      });
      return;
    }
    
    navigate("/confirmation");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-start mb-4">
        <Avatar initial="A" size="lg" position="first" className="mr-3" />
        <h1 className="text-xl font-semibold">Almost done!</h1>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700 font-medium">Getting together</p>
        <p className="text-gray-700">{date} from {timeRange}</p>
      </div>
      
      <p className="mb-4 text-gray-700">Sam suggests these spots. Which work for you?</p>
      
      <div className="space-y-4 mb-6">
        {locations.map((loc, index) => (
          <div 
            key={index} 
            className={`bg-white rounded-lg border ${selectedOption === loc.name ? 'border-purple' : 'border-gray-200'} p-4 cursor-pointer transition-all`}
            onClick={() => handleSelectOption(loc.name)}
          >
            <p className="font-medium text-gray-800">{loc.name}</p>
            <p className="text-sm text-gray-600">{loc.note}</p>
          </div>
        ))}
      </div>
      
      {hasDifferentIdea ? (
        <div className="mb-6">
          <textarea
            value={differentIdeaText}
            onChange={(e) => setDifferentIdeaText(e.target.value)}
            placeholder="Suggest a different location..."
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple"
            rows={3}
          />
        </div>
      ) : (
        <button
          onClick={handleDifferentIdea}
          className="w-full text-center text-gray-500 py-2 mb-6 text-sm"
        >
          I've got a different idea
        </button>
      )}
      
      <Button
        onClick={handleSubmit}
        className="w-full bg-purple-light hover:bg-purple-light/90 text-purple-700 flex justify-center items-center"
      >
        These work for me! <ArrowRight size={16} className="ml-1" />
      </Button>
    </div>
  );
};

export default AbbyLocationResponse;
