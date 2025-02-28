
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
    
    // First, handle specific initials with fixed colors
    if (formattedLetter === 'A') return 'bg-orange-500';
    if (formattedLetter === 'J') return 'bg-purple-500';
    if (formattedLetter === 'S') return 'bg-green-500';
    
    // For other initials, use a deterministic but varied approach
    const charCode = letter.charCodeAt(0);
    if (charCode % 3 === 0) return 'bg-orange-500';
    if (charCode % 3 === 1) return 'bg-purple-500';
    return 'bg-green-500';
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
