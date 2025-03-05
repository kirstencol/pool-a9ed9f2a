
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

  const getAvatarClass = (position?: string) => {
    // Consistent color mapping based on position
    if (position === "first") return 'bg-lime'; // Abby (lime green)
    if (position === "second") return 'bg-purple-700'; // Burt (deep purple)
    if (position === "third") return 'bg-purple-300'; // Carrie (light purple)
    
    // Fallback to a default color if no position specified
    return 'bg-gray-300';
  };

  return (
    <div 
      className={cn(
        "avatar-circle", 
        getAvatarClass(position), 
        sizeClasses[size], 
        className
      )}
    >
      {initial.toUpperCase()}
    </div>
  );
};

export default Avatar;
