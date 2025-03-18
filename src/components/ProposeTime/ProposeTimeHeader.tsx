
import Avatar from "@/components/Avatar";
import { User } from "@/types";

interface ProposeTimeHeaderProps {
  currentUser: User | null;
}

const ProposeTimeHeader = ({ currentUser }: ProposeTimeHeaderProps) => {
  if (!currentUser) return null;
  
  return (
    <div className="flex items-center mb-6 sm:mb-8">
      <Avatar initial={currentUser.initial} position="first" size="lg" className="mr-4" />
      <h1 className="text-xl sm:text-2xl font-semibold">When are you free?</h1>
    </div>
  );
};

export default ProposeTimeHeader;
