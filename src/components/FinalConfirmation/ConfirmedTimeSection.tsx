
import TimeSlotCard from "@/components/TimeSlotCard";
import { TimeSlot } from "@/types";

interface ConfirmedTimeSectionProps {
  selectedTimeSlot: TimeSlot;
}

const ConfirmedTimeSection = ({ selectedTimeSlot }: ConfirmedTimeSectionProps) => {
  return (
    <div className="mb-6">
      <h2 className="font-medium mb-2">Time confirmed:</h2>
      <TimeSlotCard 
        timeSlot={selectedTimeSlot}
        selectedByUser
        className="mb-6"
      />
    </div>
  );
};

export default ConfirmedTimeSection;
