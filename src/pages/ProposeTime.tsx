
import { useProposeTime } from "@/hooks/useProposeTime";
import { hasValidTimeSlots } from "@/components/ProposeTime/TimeValidationUtils";
import ProposeTimeHeader from "@/components/ProposeTime/ProposeTimeHeader";
import TimeSlotForm from "@/components/ProposeTime/TimeSlotForm";
import SubmitButton from "@/components/ProposeTime/SubmitButton";

const ProposeTime = () => {
  const {
    timeSlots,
    isSubmitting,
    updateTimeSlot,
    clearTimeSlot,
    handleSendToFriends,
    currentUser
  } = useProposeTime();

  // Return null if no current user as the useEffect in the hook will handle redirection
  if (!currentUser) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      <ProposeTimeHeader currentUser={currentUser} />

      <div className="space-y-6 sm:space-y-8">
        {timeSlots.map((slot, index) => (
          <TimeSlotForm
            key={index}
            index={index}
            timeSlot={slot}
            updateTimeSlot={updateTimeSlot}
            clearTimeSlot={clearTimeSlot}
          />
        ))}

        <SubmitButton
          onClick={handleSendToFriends}
          disabled={!hasValidTimeSlots(timeSlots)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
};

export default ProposeTime;
