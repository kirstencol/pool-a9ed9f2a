
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import {
  FinalConfirmationHeader,
  ConfirmedTimeSection,
  LocationSelectionSection,
  AttendeesSection,
  NotesSection
} from "@/components/FinalConfirmation";

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
      <FinalConfirmationHeader />
      
      <ConfirmedTimeSection selectedTimeSlot={selectedTimeSlot} />
      
      <LocationSelectionSection 
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={handleSelectLocation}
      />
      
      <AttendeesSection 
        currentUser={currentUser}
        participants={participants}
      />
      
      <NotesSection 
        notes={notes}
        onNotesChange={handleNotesChange}
      />

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
