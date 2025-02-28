
import { Location } from "@/types";
import { useState } from "react";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

interface LocationCardProps {
  location: Location;
  selectedByUser?: boolean;
  showNoteInput?: boolean;
  onSelect?: () => void;
  onNoteChange?: (note: string) => void;
  className?: string;
  onClick?: () => void;
}

const LocationCard = ({
  location,
  selectedByUser = false,
  showNoteInput = false,
  onSelect,
  onNoteChange,
  className,
  onClick
}: LocationCardProps) => {
  const [note, setNote] = useState("");

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value);
    if (onNoteChange) {
      onNoteChange(e.target.value);
    }
  };

  const handleClick = () => {
    if (onClick) onClick();
    if (onSelect) onSelect();
  };

  return (
    <div 
      className={cn(
        "location-card",
        selectedByUser && "selected",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex-grow">
          <h3 className="font-medium mb-1">{location.name}</h3>
          <p className="text-gray-600 text-sm">{location.description}</p>
        </div>
        <Avatar 
          initial={location.suggestedBy.charAt(0)} 
          size="sm"
          className="ml-3 flex-shrink-0"
        />
      </div>

      {showNoteInput && selectedByUser && (
        <div className="mt-4">
          <textarea
            placeholder="Add a note (optional)"
            className="w-full p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
            value={note}
            onChange={handleNoteChange}
            rows={2}
          />
        </div>
      )}
    </div>
  );
};

export default LocationCard;
