
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import LocationCard from "@/components/LocationCard";
import { Location } from "@/types";

const SelectLocation = () => {
  const navigate = useNavigate();
  const { currentUser, participants, addLocation, selectedTimeSlot } = useMeeting();
  const [locations, setLocations] = useState<Location[]>([
    {
      id: "1",
      name: "Coffee Shop",
      description: "A cozy spot with great lattes",
      suggestedBy: "C",
    },
    {
      id: "2",
      name: "Park Bench",
      description: "Fresh air and people watching",
      suggestedBy: "J",
    }
  ]);
  const [newLocationName, setNewLocationName] = useState("");
  const [newLocationDesc, setNewLocationDesc] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  if (!currentUser || !selectedTimeSlot) {
    navigate("/");
    return null;
  }

  const handleAddLocation = () => {
    if (newLocationName.trim() && newLocationDesc.trim()) {
      const newLocation: Location = {
        id: crypto.randomUUID(),
        name: newLocationName.trim(),
        description: newLocationDesc.trim(),
        suggestedBy: currentUser.initial,
      };
      
      addLocation(newLocation);
      setLocations([...locations, newLocation]);
      setNewLocationName("");
      setNewLocationDesc("");
      setShowAddForm(false);
    }
  };

  const handleContinue = () => {
    navigate("/location-confirmation");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <Avatar initial={currentUser.initial} size="lg" className="mr-4" />
        <div>
          <h1 className="text-2xl font-semibold">Great news!</h1>
          <p className="text-gray-600">This time works for everyone.</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Choose where to meet:</h2>
          <button 
            className="p-2 rounded-full text-purple-500 hover:bg-purple-100"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={20} />
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl animate-fade-in">
            <input
              type="text"
              placeholder="Location name"
              className="w-full border-b border-gray-300 py-2 mb-2 bg-transparent focus:outline-none focus:border-purple-500"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
            />
            <textarea
              placeholder="Short description"
              className="w-full border-b border-gray-300 py-2 mb-4 bg-transparent focus:outline-none focus:border-purple-500"
              rows={2}
              value={newLocationDesc}
              onChange={(e) => setNewLocationDesc(e.target.value)}
            />
            <button
              onClick={handleAddLocation}
              className="action-button"
              disabled={!newLocationName.trim() || !newLocationDesc.trim()}
            >
              Add Location
            </button>
          </div>
        )}

        <div className="space-y-4">
          {locations.map((location) => (
            <LocationCard 
              key={location.id} 
              location={location}
              onClick={() => {}}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="action-button"
      >
        Continue
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default SelectLocation;
