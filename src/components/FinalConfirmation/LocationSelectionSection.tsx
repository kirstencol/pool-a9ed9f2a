
import { useState } from "react";
import { Location } from "@/types";
import LocationCard from "@/components/LocationCard";

interface LocationSelectionSectionProps {
  locations: Location[];
  onSelectLocation: (id: string) => void;
  selectedLocationId: string | null;
}

const LocationSelectionSection = ({ 
  locations, 
  onSelectLocation, 
  selectedLocationId 
}: LocationSelectionSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="font-medium mb-4">Location confirmed:</h2>
      <div className="space-y-4">
        {locations.map((location) => (
          <LocationCard 
            key={location.id} 
            location={location}
            selectedByUser={location.id === selectedLocationId}
            onClick={() => onSelectLocation(location.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LocationSelectionSection;
