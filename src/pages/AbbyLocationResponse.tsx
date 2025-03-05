
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";
import LocationSuggestionsList from "@/components/LocationSuggestionsList";
import CustomLocationInput from "@/components/CustomLocationInput";
import { useLocationSelection } from "@/hooks/useLocationSelection";

const AbbyLocationResponse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Demo data for Carrie's location suggestions
  const initialLocations = [
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
  ];
  
  const locationSelection = useLocationSelection({ initialLocations });
  
  // Updated date and time for the demo
  const date = "Saturday, March 2nd";
  const timeRange = "8:00 a.m. to 9:00 a.m.";
  
  const handleSubmit = () => {
    const { selectedLocations, hasCustomSelection, customLocation } = locationSelection.getSelectedLocations();
    
    if (selectedLocations.length > 0 || hasCustomSelection) {
      let description = "";
      
      if (selectedLocations.length > 0) {
        const locationNames = selectedLocations.map(loc => loc.name).join(", ");
        description = `You selected: ${locationNames}`;
      }
      
      if (hasCustomSelection && customLocation) {
        if (description) {
          description += ` and your suggestion: ${customLocation.name}`;
        } else {
          description = `You suggested: ${customLocation.name}`;
        }
        
        if (customLocation.note) {
          description += ` - ${customLocation.note}`;
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
        locations={locationSelection.locations}
        onSelectLocation={locationSelection.handleSelectLocation}
        onNoteChange={locationSelection.handleNoteChange}
      />
      
      {locationSelection.hasDifferentIdea ? (
        <CustomLocationInput 
          isSelected={locationSelection.differentIdeaSelected}
          locationName={locationSelection.differentIdeaName}
          setLocationName={locationSelection.setDifferentIdeaName}
          noteText={locationSelection.differentIdeaText}
          setNoteText={locationSelection.setDifferentIdeaText}
          onToggleSelection={locationSelection.toggleDifferentIdeaSelection}
          onClear={(e) => {
            e.stopPropagation();
            locationSelection.clearDifferentIdea();
          }}
        />
      ) : (
        <button
          onClick={locationSelection.handleDifferentIdea}
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
