
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";
import { LocationWithNote } from "@/types";
import LocationSuggestionsList from "@/components/LocationSuggestionsList";
import CustomLocationInput from "@/components/CustomLocationInput";

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
  const [differentIdeaName, setDifferentIdeaName] = useState("");
  const [differentIdeaSelected, setDifferentIdeaSelected] = useState(true); // Default to selected
  
  const handleSelectLocation = (index: number) => {
    const updatedLocations = [...locations];
    updatedLocations[index].selected = !updatedLocations[index].selected;
    setLocations(updatedLocations);
    
    // Count total selected options including user's custom idea
    const totalSelected = updatedLocations.filter(loc => loc.selected).length + 
                         (differentIdeaSelected ? 1 : 0);
    
    // If we're trying to select more than 3 options, show a toast
    if (totalSelected > 3) {
      toast({
        title: "Maximum selections reached",
        description: "Please select a maximum of 3 locations",
        variant: "destructive"
      });
      // Revert selection
      updatedLocations[index].selected = !updatedLocations[index].selected;
      setLocations(updatedLocations);
    }
  };
  
  const handleNoteChange = (index: number, note: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index].userNote = note;
    setLocations(updatedLocations);
  };
  
  const handleDifferentIdea = () => {
    setHasDifferentIdea(true);
    setDifferentIdeaSelected(true); // Auto-select when added
  };
  
  const toggleDifferentIdeaSelection = () => {
    // Count total selected options from regular locations
    const totalSelected = locations.filter(loc => loc.selected).length;
    
    if (!differentIdeaSelected && totalSelected >= 3) {
      toast({
        title: "Maximum selections reached",
        description: "Please select a maximum of 3 locations",
        variant: "destructive"
      });
      return;
    }
    
    setDifferentIdeaSelected(!differentIdeaSelected);
  };

  const clearDifferentIdea = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    setHasDifferentIdea(false);
    setDifferentIdeaName("");
    setDifferentIdeaText("");
    setDifferentIdeaSelected(false);
  };
  
  const handleSubmit = () => {
    const selectedLocations = locations.filter(loc => loc.selected);
    const hasCustomSelection = hasDifferentIdea && differentIdeaName && differentIdeaSelected;
    
    if (selectedLocations.length > 0 || hasCustomSelection) {
      let description = "";
      
      if (selectedLocations.length > 0) {
        const locationNames = selectedLocations.map(loc => loc.name).join(", ");
        description = `You selected: ${locationNames}`;
      }
      
      if (hasCustomSelection) {
        if (description) {
          description += ` and your suggestion: ${differentIdeaName}`;
        } else {
          description = `You suggested: ${differentIdeaName}`;
        }
        
        if (differentIdeaText) {
          description += ` - ${differentIdeaText}`;
        }
      }
      
      toast({
        title: "Response submitted!",
        description
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
      
      <p className="mb-4 text-gray-700">Carrie suggests these spots. Which work for you? <span className="text-sm text-gray-500">(Select up to 3)</span></p>
      
      <LocationSuggestionsList 
        locations={locations}
        onSelectLocation={handleSelectLocation}
        onNoteChange={handleNoteChange}
      />
      
      {hasDifferentIdea ? (
        <CustomLocationInput 
          isSelected={differentIdeaSelected}
          locationName={differentIdeaName}
          setLocationName={setDifferentIdeaName}
          noteText={differentIdeaText}
          setNoteText={setDifferentIdeaText}
          onToggleSelection={toggleDifferentIdeaSelection}
          onClear={clearDifferentIdea}
        />
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
