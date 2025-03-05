
import { useState } from "react";
import { LocationWithNote } from "@/types";
import { useToast } from "@/hooks/use-toast";

export interface UseLocationSelectionProps {
  initialLocations?: LocationWithNote[];
  maxSelections?: number;
}

export function useLocationSelection({ 
  initialLocations = [], 
  maxSelections = 3 
}: UseLocationSelectionProps = {}) {
  const { toast } = useToast();
  const [locations, setLocations] = useState<LocationWithNote[]>(initialLocations);
  const [hasDifferentIdea, setHasDifferentIdea] = useState(false);
  const [differentIdeaText, setDifferentIdeaText] = useState("");
  const [differentIdeaName, setDifferentIdeaName] = useState("");
  const [differentIdeaSelected, setDifferentIdeaSelected] = useState(true);

  const handleSelectLocation = (index: number) => {
    const updatedLocations = [...locations];
    updatedLocations[index].selected = !updatedLocations[index].selected;
    
    // Count total selected options including user's custom idea
    const totalSelected = updatedLocations.filter(loc => loc.selected).length + 
                        (differentIdeaSelected ? 1 : 0);
    
    // If we're trying to select more than allowed options, show a toast
    if (totalSelected > maxSelections) {
      toast({
        title: `Maximum selections reached`,
        description: `Please select a maximum of ${maxSelections} locations`,
        variant: "destructive"
      });
      // Revert selection
      updatedLocations[index].selected = !updatedLocations[index].selected;
      setLocations(updatedLocations);
      return;
    }
    
    setLocations(updatedLocations);
  };
  
  const handleNoteChange = (index: number, note: string) => {
    const updatedLocations = [...locations];
    updatedLocations[index].userNote = note;
    setLocations(updatedLocations);
  };
  
  const handleDifferentIdea = () => {
    setHasDifferentIdea(true);
    setDifferentIdeaSelected(true);
  };
  
  const toggleDifferentIdeaSelection = () => {
    // Count total selected options from regular locations
    const totalSelected = locations.filter(loc => loc.selected).length;
    
    if (!differentIdeaSelected && totalSelected >= maxSelections) {
      toast({
        title: `Maximum selections reached`,
        description: `Please select a maximum of ${maxSelections} locations`,
        variant: "destructive"
      });
      return;
    }
    
    setDifferentIdeaSelected(!differentIdeaSelected);
  };

  const clearDifferentIdea = () => {
    setHasDifferentIdea(false);
    setDifferentIdeaName("");
    setDifferentIdeaText("");
    setDifferentIdeaSelected(false);
  };

  const getSelectedLocations = () => {
    const selectedLocations = locations.filter(loc => loc.selected);
    const hasCustomSelection = hasDifferentIdea && differentIdeaName && differentIdeaSelected;
    
    return {
      selectedLocations,
      hasCustomSelection,
      customLocation: hasCustomSelection ? { name: differentIdeaName, note: differentIdeaText } : null
    };
  };

  return {
    locations,
    setLocations,
    hasDifferentIdea,
    differentIdeaName,
    setDifferentIdeaName,
    differentIdeaText,
    setDifferentIdeaText,
    differentIdeaSelected,
    handleSelectLocation,
    handleNoteChange,
    handleDifferentIdea,
    toggleDifferentIdeaSelection,
    clearDifferentIdea,
    getSelectedLocations
  };
}
