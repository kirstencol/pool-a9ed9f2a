
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Avatar from "@/components/Avatar";
import TimeSlotCard from "@/components/TimeSlotCard";

const BurtConfirmed = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notes, setNotes] = useState("");
  
  // Get the state from navigation or use demo data if not available
  const state = location.state || {
    selectedLocation: {
      name: "Central Cafe",
      note: "Suggested by Carrie",
      selected: true,
      userNote: "I like this spot and Abby says they serve great coffee!"
    },
    meetingTime: {
      id: "time-1",
      date: "Saturday, March 2nd",
      startTime: "8:00 a.m.",
      endTime: "9:00 a.m.",
      selected: true
    }
  };
  
  const { selectedLocation, meetingTime } = state;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleAddToCalendar = () => {
    navigate("/add-to-calendar");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <div className="celebration-animation">
          <Check className="text-white" size={32} />
        </div>
      </div>
      
      <h1 className="text-2xl font-semibold text-center mb-8">It's happening!</h1>

      <div className="mb-6">
        <h2 className="font-medium mb-2">Time confirmed:</h2>
        <TimeSlotCard 
          timeSlot={meetingTime}
          selectedByUser
          className="mb-6"
        />
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">Location confirmed:</h2>
        <div className="p-4 rounded-xl bg-purple/10 border-2 border-purple">
          <h3 className="text-lg font-semibold mb-2">{selectedLocation.name}</h3>
          <div className="flex items-start mb-2">
            {selectedLocation.note.includes("Carrie") ? (
              <Avatar initial="C" size="sm" position="third" className="mr-2 flex-shrink-0" />
            ) : (
              <Avatar initial="A" size="sm" position="first" className="mr-2 flex-shrink-0" />
            )}
            <p className="text-gray-700 text-sm">{selectedLocation.userNote}</p>
          </div>
          <div className="flex items-start">
            <Avatar initial="B" size="sm" position="second" className="mr-2 flex-shrink-0" />
            <p className="text-purple-700 text-sm font-medium">You selected this location</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">Attendees:</h2>
        <div className="flex -space-x-2">
          <Avatar initial="A" position="first" className="border-2 border-white" />
          <Avatar initial="B" position="second" className="border-2 border-white" />
          <Avatar initial="C" position="third" className="border-2 border-white" />
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

      <Button
        onClick={handleAddToCalendar}
        className="action-button"
      >
        Add to calendar
        <ArrowRight className="ml-2" size={20} />
      </Button>
    </div>
  );
};

export default BurtConfirmed;
