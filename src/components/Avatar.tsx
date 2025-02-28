
import { cn } from "@/lib/utils";

interface AvatarProps {
  initial: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Avatar = ({ initial, size = "md", className }: AvatarProps) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-16 h-16 text-2xl",
  };

  const getAvatarClass = (letter: string) => {
    const formattedLetter = letter.toUpperCase();
    
    // First, handle specific initials with fixed colors for common letters
    if (formattedLetter === 'A') return 'bg-purple-300'; // Light purple
    if (formattedLetter === 'J') return 'bg-purple-700'; // Deep purple
    if (formattedLetter === 'S') return 'bg-green-300'; // Light lime green
    
    // For other initials, use a deterministic approach with our three colors
    // Modified to make sure we get more variation
    const charCode = letter.charCodeAt(0);
    if (charCode % 4 === 0) return 'bg-purple-300'; // Light purple
    if (charCode % 4 === 1 || charCode % 4 === 3) return 'bg-green-300';  // Light lime green
    return 'bg-purple-700'; // Deep purple
  };

  return (
    <div 
      className={cn(
        "avatar-circle", 
        getAvatarClass(initial), 
        sizeClasses[size], 
        className
      )}
    >
      {initial.toUpperCase()}
    </div>
  );
};

export default Avatar;
