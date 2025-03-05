
import React from "react";
import LocationCard from "@/components/LocationCard";
import { LocationWithNote } from "@/types";

interface LocationSuggestionsListProps {
  locations: LocationWithNote[];
  onSelectLocation: (index: number) => void;
  onNoteChange: (index: number, note: string) => void;
}

const LocationSuggestionsList = ({
  locations,
  onSelectLocation,
  onNoteChange
}: LocationSuggestionsListProps) => {
  return (
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
          onSelect={() => onSelectLocation(index)}
          onNoteChange={(note) => onNoteChange(index, note)}
          showAuthor={true}
          authorInitial="C"
          authorPosition="third"
          userInitial="A"
          userPosition="first"
        />
      ))}
    </div>
  );
};

export default LocationSuggestionsList;
