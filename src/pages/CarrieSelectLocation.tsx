import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Avatar from "@/components/Avatar";

type LocationOption = {
  id: string;
  name: string;
  note?: string;
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
  
  const [locationOptions, setLocationOptions] = useState<LocationOption[]>([
    { id: "1", name: "", note: "" }
  ]);
  
  const MAX_LOCATIONS = 3;

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

  const handleLocationChange = (id: string, field: 'name' | 'note', value: string) => {
    setLocationOptions(prev => 
      prev.map(loc => 
        loc.id === id ? { ...loc, [field]: value } : loc
      )
    );
  };

  const handleAddLocation = () => {
    if (locationOptions.length < MAX_LOCATIONS) {
      setLocationOptions([...locationOptions, { id: Date.now().toString(), name: "", note: "" }]);
    }
  };

  const handleSendSuggestions = () => {
    // Filter out empty locations
    const validLocations = locationOptions.filter(loc => loc.name.trim() !== "");
    
    if (validLocations.length === 0) {
      toast({
        title: "Please suggest at least one location",
        variant: "destructive"
      });
      return;
    }

    // Combine all location names with commas
    const locationNames = validLocations.map(loc => loc.name).join(", ");
    
    // Include notes in the URL if they exist
    const locationData = validLocations.map(loc => ({
      name: loc.name,
      note: loc.note || ""
    }));
    
    // Convert to JSON and encode
    const encodedLocations = encodeURIComponent(JSON.stringify(locationData));
    
    navigate(`/carrie-confirmation?id=${inviteId}&date=${date}&startTime=${startTime}&endTime=${endTime}&location=${locationNames}&locData=${encodedLocations}`);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-8 animate-fade-in">
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
        {locationOptions.map((loc, index) => (
          <div key={loc.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} className="text-gray-400" />
              <input
                type="text"
                value={loc.name}
                onChange={(e) => handleLocationChange(loc.id, 'name', e.target.value)}
                placeholder="Enter place name"
                className="w-full border-none focus:outline-none focus:ring-0 p-0"
              />
            </div>
            <textarea
              value={loc.note}
              onChange={(e) => handleLocationChange(loc.id, 'note', e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full text-sm text-gray-500 border-none focus:outline-none focus:ring-0 resize-none p-0"
              rows={2}
            />
          </div>
        ))}

        {locationOptions.length < MAX_LOCATIONS && (
          <button 
            onClick={handleAddLocation}
            className="w-full border-2 border-dashed border-gray-200 rounded-lg p-4 text-gray-400 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} className="mr-2" /> add another option
          </button>
        )}
      </div>

      <Button 
        onClick={handleSendSuggestions}
        variant="secondary"
        className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 flex items-center justify-center gap-2"
      >
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};

export default CarrieSelectLocation;
