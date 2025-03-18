
import { TimeSlot } from "@/types";
import TimeSlotCard from "@/components/TimeSlotCard";

interface ConfirmedTimeSlotsProps {
  timeSlots: TimeSlot[];
  currentUserName: string;
}

const ConfirmedTimeSlots = ({ timeSlots, currentUserName }: ConfirmedTimeSlotsProps) => {
  console.log("ConfirmedTimeSlots received timeSlots:", timeSlots);
  
  if (!timeSlots || timeSlots.length === 0) {
    return (
      <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center">
        <p className="text-gray-600">No time slots have been added yet.</p>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="font-medium mb-4">You're free:</h2>
      <div className="space-y-4">
        {timeSlots.map((timeSlot) => (
          <TimeSlotCard 
            key={timeSlot.id} 
            timeSlot={timeSlot} 
            creatorAvailable 
            creatorName={currentUserName} 
          />
        ))}
      </div>
    </div>
  );
};

export default ConfirmedTimeSlots;
