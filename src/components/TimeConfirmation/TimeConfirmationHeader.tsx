
import Avatar from "@/components/Avatar";
import { User } from "@/types";

interface TimeConfirmationHeaderProps {
  currentUser: User;
}

const TimeConfirmationHeader = ({ currentUser }: TimeConfirmationHeaderProps) => {
  return (
    <div className="flex items-center mb-8">
      <Avatar initial={currentUser.initial} position="first" size="lg" className="mr-4" />
      <div>
        <h1 className="text-2xl font-semibold">Perfect, done!</h1>
        <p className="text-gray-600">Let's share your availability.</p>
      </div>
    </div>
  );
};

export default TimeConfirmationHeader;
