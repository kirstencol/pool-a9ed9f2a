
import { useNavigate } from "react-router-dom";
import { CalendarPlus, Copy, Check } from "lucide-react";
import { useMeeting } from "@/context/meeting";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const AddToCalendar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, participants, selectedTimeSlot, selectedLocation, meetingNotes } = useMeeting();
  const [copied, setCopied] = useState(false);

  if (!currentUser || !selectedTimeSlot || !selectedLocation) {
    navigate("/");
    return null;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const eventDetails = `
    What: Meetup with ${participants.map(p => p.name).join(" and ")}
    When: ${formatDate(selectedTimeSlot.date)}, ${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}
    Where: ${selectedLocation.name} - ${selectedLocation.description}
    ${meetingNotes ? `\nNotes: ${meetingNotes}` : ''}
  `;

  const copyDetails = () => {
    navigator.clipboard.writeText(eventDetails.trim());
    setCopied(true);
    toast({
      title: "Details copied!",
      description: "You can paste them into your calendar",
    });
    setTimeout(() => setCopied(false), 3000);
  };

  // These would be actual calendar links in a full implementation
  const googleCalendarLink = "#google-calendar";
  const appleCalendarLink = "#apple-calendar";
  const outlookCalendarLink = "#outlook-calendar";

  return (
    <div className="max-w-md mx-auto px-6 py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <CalendarPlus className="text-purple-500" size={32} />
        </div>
        <h1 className="text-2xl font-semibold">Add to your calendar</h1>
        <p className="text-gray-600">Save the date and don't miss out!</p>
      </div>

      <div className="mb-8 space-y-4">
        <Button 
          asChild
          variant="purpleOutline"
        >
          <a href={googleCalendarLink}>Google Calendar</a>
        </Button>
        
        <Button 
          asChild
          variant="purpleOutline"
        >
          <a href={appleCalendarLink}>Apple Calendar</a>
        </Button>
        
        <Button 
          asChild
          variant="purpleOutline"
        >
          <a href={outlookCalendarLink}>Outlook Calendar</a>
        </Button>
      </div>

      <div className="border border-gray-300 rounded-xl p-4 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-medium">Event details:</h2>
          <button 
            onClick={copyDetails}
            className="p-2 text-purple-500 hover:bg-purple-50 rounded-full"
          >
            {copied ? (
              <Check size={20} />
            ) : (
              <Copy size={20} />
            )}
          </button>
        </div>
        <pre className="whitespace-pre-wrap text-sm text-gray-600 font-sans">
          {eventDetails}
        </pre>
      </div>

      <Button
        onClick={() => navigate("/")}
        variant="secondaryAction"
      >
        Back to home
      </Button>
    </div>
  );
};

export default AddToCalendar;
