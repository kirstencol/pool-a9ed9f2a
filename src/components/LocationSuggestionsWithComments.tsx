import React from "react";
import type { LocationWithComments } from "@/types";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

interface LocationSuggestionProps {
  location: LocationWithComments;
  isSelected: boolean;
  onSelect: () => void;
  onNoteChange: (note: string) => void;
}

// For a single location card with comments
const LocationWithComments = ({
  location,
  isSelected,
  onSelect,
  onNoteChange
}: LocationSuggestionProps) => {
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNoteChange(e.target.value);
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg border p-4 mb-4 cursor-pointer transition-all",
        isSelected ? "border-purple" : "border-gray-200"
      )}
      onClick={onSelect}
    >
      <div className="text-xl font-medium mb-2">{location.name}</div>
      
      {/* Carrie's comment */}
      <div className="flex items-start mb-3">
        <Avatar 
          initial="C" 
          size="sm" 
          position="third" 
          className="mr-2 mt-1" 
        />
        <p className="text-sm text-gray-600">{location.note}</p>
      </div>
      
      {/* Abby's comment */}
      {location.abbyComment && (
        <div className="flex items-start mb-3">
          <Avatar 
            initial="A" 
            size="sm" 
            position="first" 
            className="mr-2 mt-1" 
          />
          <p className="text-sm text-gray-600">{location.abbyComment}</p>
        </div>
      )}
      
      {/* Burt's note input (only shows when selected) */}
      {isSelected && (
        <div className="mt-3">
          <div className="flex items-start">
            <Avatar 
              initial="B" 
              size="sm" 
              position="second" 
              className="mr-2 mt-2" 
            />
            <textarea
              placeholder="Add a note (optional)"
              className="flex-grow p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
              value={location.userNote || ""}
              onChange={handleNoteChange}
              onClick={(e) => e.stopPropagation()}
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface LocationSuggestionsListProps {
  locations: LocationWithComments[];
  onSelectLocation: (index: number) => void;
  onNoteChange: (index: number, note: string) => void;
}

const LocationSuggestionsList = ({
  locations,
  onSelectLocation,
  onNoteChange
}: LocationSuggestionsListProps) => {
  return (
    <div className="mb-6">
      {locations.map((location, index) => (
        <LocationWithComments
          key={index}
          location={location}
          isSelected={location.selected}
          onSelect={() => onSelectLocation(index)}
          onNoteChange={(note) => onNoteChange(index, note)}
        />
      ))}
    </div>
  );
};

export default LocationSuggestionsList;
