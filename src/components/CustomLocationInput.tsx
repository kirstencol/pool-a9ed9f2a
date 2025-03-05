
import React from "react";
import { MapPin, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomLocationInputProps {
  isSelected: boolean;
  locationName: string;
  setLocationName: (name: string) => void;
  noteText: string;
  setNoteText: (note: string) => void;
  onToggleSelection: () => void;
  onClear: (e: React.MouseEvent) => void;
}

const CustomLocationInput = ({
  isSelected,
  locationName,
  setLocationName,
  noteText,
  setNoteText,
  onToggleSelection,
  onClear,
}: CustomLocationInputProps) => {
  return (
    <div 
      className={`mb-6 bg-white rounded-lg border ${isSelected ? "border-purple" : "border-gray-200"} p-4 animate-fade-in relative`}
      onClick={onToggleSelection}
    >
      <button 
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={onClear}
      >
        <X size={18} />
      </button>
      <div className="flex items-center gap-2 mb-3">
        <MapPin size={18} className="text-gray-400" />
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Enter place name"
          className="w-full border-none focus:outline-none focus:ring-0 p-0"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Add a note (optional)"
        className="w-full text-sm text-gray-500 border-none focus:outline-none focus:ring-0 resize-none p-0"
        rows={2}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default CustomLocationInput;
