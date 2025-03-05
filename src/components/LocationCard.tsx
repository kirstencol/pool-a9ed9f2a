
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
  showAuthor?: boolean;
  authorInitial?: string;
  authorPosition?: "first" | "second" | "third";
  userInitial?: string;
  userPosition?: "first" | "second" | "third";
}

const LocationCard = ({
  location,
  selectedByUser = false,
  showNoteInput = false,
  onSelect,
  onNoteChange,
  className,
  onClick,
  showAuthor = false,
  authorInitial,
  authorPosition,
  userInitial = "A", 
  userPosition = "first"
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
        "location-card bg-white rounded-lg border",
        selectedByUser ? "border-purple" : "border-gray-200",
        "p-4 transition-all cursor-pointer",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-start">
        <div className="flex-grow">
          <h3 className="font-medium mb-1">{location.name}</h3>
          {showAuthor && authorInitial ? (
            <div className="flex items-center mt-1 mb-1">
              <Avatar 
                initial={authorInitial} 
                size="sm" 
                position={authorPosition} 
                className="mr-2" 
              />
              <p className="text-sm text-gray-600">{location.description}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{location.description}</p>
          )}
        </div>
        {!showAuthor && (
          <Avatar 
            initial={location.suggestedBy.charAt(0)} 
            size="sm"
            className="ml-3 flex-shrink-0"
          />
        )}
      </div>

      {showNoteInput && selectedByUser && (
        <div className="mt-4">
          <div className="flex items-start mt-2">
            <Avatar 
              initial={userInitial} 
              size="sm" 
              position={userPosition} 
              className="mr-2 mt-2" 
            />
            <textarea
              placeholder="Add a note (optional)"
              className="flex-grow p-2 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-purple-500 text-sm"
              value={note}
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

export default LocationCard;
