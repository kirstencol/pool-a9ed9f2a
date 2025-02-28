
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { useMeeting } from "@/context/MeetingContext";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";
import LocationCard from "@/components/LocationCard";

const FinalConfirmation = () => {
  const navigate = useNavigate();
  const { currentUser, participants, selectedTimeSlot, locations, setMeetingNotes } = useMeeting();
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  if (!currentUser || !selectedTimeSlot || !locations.length) {
    navigate("/");
    return null;
  }

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setMeetingNotes(e.target.value);
  };

  const handleConfirm = () => {
    navigate("/add-to-calendar");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center mb-8">
        <div className="celebration-animation">
          <Check className="text-white" size={32} />
        </div>
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-8">It's happening!</h1>

      <div className="mb-6">
        <h2 className="font-medium mb-2">Time confirmed:</h2>
        <TimeSlotCard 
          timeSlot={selectedTimeSlot}
          selectedByUser
          className="mb-6"
        />
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">Location confirmed:</h2>
        <div className="space-y-4">
          {locations.map((location) => (
            <LocationCard 
              key={location.id} 
              location={location}
              selectedByUser={location.id === selectedLocationId}
              onClick={() => handleSelectLocation(location.id)}
            />
          ))}
        </div>
      </div>

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

      <div className="mb-8">
        <h2 className="font-medium mb-4">Notes:</h2>
        <textarea
          placeholder="Add any notes for the meeting..."
          className="w-full p-4 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-purple-500"
          rows={4}
          value={notes}
          onChange={handleNotesChange}
        />
      </div>

      <button
        onClick={handleConfirm}
        className="action-button"
      >
        Add to calendar
        <ArrowRight className="ml-2" size={20} />
      </button>
    </div>
  );
};

export default FinalConfirmation;
