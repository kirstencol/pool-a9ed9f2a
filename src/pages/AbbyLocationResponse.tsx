
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";
import LocationCard from "@/components/LocationCard";
import { Location } from "@/types";

type LocationWithNote = {
  name: string;
  note: string;
  selected?: boolean;
  userNote?: string;
};

const AbbyLocationResponse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Demo data for Carrie's location suggestions
  const [locations, setLocations] = useState<LocationWithNote[]>([
    { 
      name: "Central Cafe", 
      note: "Great coffee and shouldn't be too hard to get a table.",
      selected: false,
      userNote: ""
    },
    { 
      name: "Starbucks on 5th", 
      note: "Not the best vibes, but central to all three of us. Plus, PSLs.",
      selected: false,
      userNote: ""
    }
  ]);
  
  // Updated date and time for the demo
  const date = "Saturday, March 2nd";
  const timeRange = "8:00 a.m. to 9:00 a.m.";
  
  const [hasDifferentIdea, setHasDifferentIdea] = useState(false);
  const [differentIdeaText, setDifferentIdeaText] = useState("");
  
  const handleSelectLocation = (index: number) => {
    const updatedLocations = [...locations];
    updatedLocations[index].selected = !updatedLocations[index].selected;
    setLocations(updatedLocations);
    
    if (hasDifferentIdea) {
      setHasDifferentIdea(false);
    }
  };
  
  const handleNoteChange = (index: number, note: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index].userNote = note;
    setLocations(updatedLocations);
  };
  
  const handleDifferentIdea = () => {
    // Deselect all locations when suggesting a different idea
    setLocations(locations.map(loc => ({ ...loc, selected: false })));
    setHasDifferentIdea(true);
  };
  
  const handleSubmit = () => {
    const selectedLocations = locations.filter(loc => loc.selected);
    
    if (selectedLocations.length > 0) {
      const locationNames = selectedLocations.map(loc => loc.name).join(", ");
      toast({
        title: "Response submitted!",
        description: `You selected: ${locationNames}`
      });
      navigate("/confirmation");
    } else if (hasDifferentIdea && differentIdeaText) {
      toast({
        title: "Response submitted!",
        description: `You suggested: ${differentIdeaText}`
      });
      navigate("/confirmation");
    } else {
      toast({
        title: "Please make a selection",
        description: "Select at least one location or suggest your own",
        variant: "destructive"
      });
    }
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
      
      <p className="mb-4 text-gray-700">Carrie suggests these spots. Which work for you?</p>
      
      <div className="space-y-4 mb-6">
        {locations.map((loc, index) => (
          <LocationCard
            key={index}
            location={{
              id: `loc-${index}`,
              name: loc.name,
              description: loc.note,
              suggestedBy: "C"
            }}
            selectedByUser={loc.selected}
            showNoteInput={true}
            onSelect={() => handleSelectLocation(index)}
            onNoteChange={(note) => handleNoteChange(index, note)}
            showAuthor={true}
            authorInitial="C"
            authorPosition="third"
            userInitial="A"
            userPosition="first"
          />
        ))}
      </div>
      
      {hasDifferentIdea ? (
        <div className="mb-6">
          <div className="flex items-start">
            <Avatar initial="A" size="sm" position="first" className="mr-2 mt-2" />
            <textarea
              value={differentIdeaText}
              onChange={(e) => setDifferentIdeaText(e.target.value)}
              placeholder="Suggest a different location..."
              className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple"
              rows={3}
            />
          </div>
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
