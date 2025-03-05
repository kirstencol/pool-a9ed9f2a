
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Location = {
  id: string;
  name: string;
  address?: string;
};

const CarrieSelectLocation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  
  const inviteId = searchParams.get("id") || "carrie_demo";
  const date = searchParams.get("date") || "";
  const startTime = searchParams.get("startTime") || "";
  const endTime = searchParams.get("endTime") || "";
  
  const [locations, setLocations] = useState<Location[]>([
    { id: "1", name: "Coffee Shop", address: "123 Main St" },
    { id: "2", name: "Library", address: "456 Oak Ave" },
    { id: "3", name: "Park", address: "789 Pine Blvd" }
  ]);
  
  const [newLocation, setNewLocation] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      const newLoc = {
        id: Date.now().toString(),
        name: newLocation.trim()
      };
      setLocations([...locations, newLoc]);
      setNewLocation("");
      setSelectedLocationId(newLoc.id);
    }
  };

  const handleContinue = () => {
    if (!selectedLocationId) {
      toast({
        title: "Please select a location",
        variant: "destructive"
      });
      return;
    }

    const selectedLocation = locations.find(loc => loc.id === selectedLocationId);
    if (selectedLocation) {
      navigate(`/carrie-confirmation?id=${inviteId}&date=${date}&startTime=${startTime}&endTime=${endTime}&location=${selectedLocation.name}`);
    }
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

      <h1 className="text-2xl font-semibold mb-6">Where should we meet?</h1>

      <div className="mb-6">
        <div className="flex mb-4">
          <input
            type="text"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Add a new location"
            className="flex-1 border-b border-gray-300 py-2 focus:outline-none focus:border-purple-DEFAULT"
          />
          <Button 
            onClick={handleAddLocation}
            variant="ghost"
            className="ml-2"
            disabled={!newLocation.trim()}
          >
            <Plus size={20} />
          </Button>
        </div>

        <div className="space-y-3 mt-6">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className={`p-4 rounded-lg border ${
                selectedLocationId === loc.id 
                  ? "border-purple-500 bg-purple-50" 
                  : "border-gray-200 hover:border-gray-300"
              } cursor-pointer transition-all`}
              onClick={() => setSelectedLocationId(loc.id)}
            >
              <h3 className="font-medium">{loc.name}</h3>
              {loc.address && <p className="text-sm text-gray-600">{loc.address}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleContinue}
          disabled={!selectedLocationId}
          className="flex items-center"
        >
          Continue
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default CarrieSelectLocation;
