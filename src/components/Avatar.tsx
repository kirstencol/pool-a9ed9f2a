
import { cn } from "@/lib/utils";

interface AvatarProps {
  initial: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  position?: "first" | "second" | "third";
}

const Avatar = ({ initial, size = "md", className, position }: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  const getAvatarClass = (letter: string, position?: string) => {
    // If position is provided, use that to determine color
    if (position === "first") return 'bg-lime'; // Use lime green for Friend A
    if (position === "second") return 'bg-purple-700'; // Deep purple for Friend B
    if (position === "third") return 'bg-purple-300'; // Light purple for Friend C
    
    // Fallback to using initials-based colors if no position specified
    const formattedLetter = letter.toUpperCase();
    
    if (formattedLetter === 'A') return 'bg-purple-300'; // Light purple
    if (formattedLetter === 'J') return 'bg-purple-700'; // Deep purple
    if (formattedLetter === 'S') return 'bg-lime'; // Lime green
    
    const charCode = letter.charCodeAt(0);
    if (charCode % 4 === 0) return 'bg-purple-300'; // Light purple
    if (charCode % 4 === 1 || charCode % 4 === 3) return 'bg-lime';  // Lime green
    return 'bg-purple-700'; // Deep purple
  };

  return (
    <div 
      className={cn(
        "avatar-circle", 
        getAvatarClass(initial, position), 
        sizeClasses[size], 
        className
      )}
    >
      {initial.toUpperCase()}
    </div>
  );
};

export default Avatar;
