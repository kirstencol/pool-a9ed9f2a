
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
    if (formattedLetter === 'A') return 'bg-orange-500';
    if (formattedLetter === 'J') return 'bg-purple-500';
    if (formattedLetter === 'S') return 'bg-green-500';
    
    // Default color based on letter
    const colors = ['bg-orange-500', 'bg-purple-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
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
