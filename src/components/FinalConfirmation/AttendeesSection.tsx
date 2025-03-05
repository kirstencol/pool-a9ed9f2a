
import Avatar from "@/components/Avatar";
import { User } from "@/types";

interface AttendeesSectionProps {
  currentUser: User;
  participants: User[];
}

const AttendeesSection = ({ currentUser, participants }: AttendeesSectionProps) => {
  return (
    <div className="mb-8">
      <h2 className="font-medium mb-4">Attendees:</h2>
      <div className="flex -space-x-2">
        <Avatar 
          initial={currentUser.initial}
          className="border-2 border-white" 
        />
        {participants.map((participant) => (
          <Avatar 
            key={participant.id} 
            initial={participant.initial}
            className="border-2 border-white" 
          />
        ))}
      </div>
    </div>
  );
};

export default AttendeesSection;
