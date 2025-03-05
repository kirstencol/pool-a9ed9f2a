
import React, { useState } from "react";
import { MapPin, Plus, ArrowRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";

interface Location {
  name: string;
  note: string;
}

interface LocationProposalProps {
  meetingDate: string;
  startTime: string;
  endTime: string;
  onGoBack: () => void;
  onSubmit: (locations: Location[]) => void;
}

const LocationProposal: React.FC<LocationProposalProps> = ({
  meetingDate,
  startTime,
  endTime,
  onGoBack,
  onSubmit
}) => {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationNote, setNewLocationNote] = useState("");

  const handleAddLocation = () => {
    if (!newLocationName.trim()) {
      toast({
        title: "Location name required",
        description: "Please enter a name for the location",
        variant: "destructive"
      });
      return;
    }
    
    setLocations([...locations, { 
      name: newLocationName.trim(),
      note: newLocationNote.trim()
    }]);
    
    setNewLocationName("");
    setNewLocationNote("");
  };

  const handleSendSuggestions = () => {
    if (locations.length === 0) {
      toast({
        title: "No locations suggested",
        description: "Please suggest at least one location",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(locations);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <Avatar initial="S" className="mx-auto mb-4" size="lg" />
        <h1 className="text-2xl font-semibold text-center">Almost done!</h1>
        <p className="text-center mt-2">Suggest a spot to meet:</p>
      </div>
      
      <div className="mb-6">
        <p className="text-lg font-medium">
          {meetingDate} from {startTime} to {endTime}
        </p>
      </div>

      {/* Location suggestion form */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6">
        <div className="flex items-center mb-4">
          <MapPin className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Enter place name"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            className="w-full focus:outline-none"
          />
        </div>
        
        <textarea
          placeholder="Add a note (optional)"
          value={newLocationNote}
          onChange={(e) => setNewLocationNote(e.target.value)}
          className="w-full h-20 border-t border-gray-200 pt-4 focus:outline-none resize-none"
        />
      </div>

      {/* Display suggested locations */}
      {locations.length > 0 && (
        <div className="space-y-4 mb-6">
          {locations.map((location, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <MapPin className="text-gray-400 mr-2" />
                <h3 className="font-medium">{location.name}</h3>
              </div>
              {location.note && <p className="text-gray-700">{location.note}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Add another location button */}
      <button
        onClick={handleAddLocation}
        className="w-full border border-dashed border-gray-300 rounded-lg py-4 px-4 flex items-center justify-center text-gray-500 mb-6"
      >
        <Plus className="w-4 h-4 mr-2" /> add another option
      </button>

      {/* Submit button */}
      <button
        onClick={handleSendSuggestions}
        className="w-full bg-purple-200 text-purple-800 py-4 rounded-lg flex items-center justify-center"
      >
        Send suggestions <ArrowRight className="ml-2 w-5 h-5" />
      </button>

      {/* Go back button */}
      <button
        onClick={onGoBack}
        className="flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors mt-6 mx-auto"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span>Go back to time selection</span>
      </button>
    </div>
  );
};

export default LocationProposal;
