
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { TimeSlot } from "@/types";

interface ResponseSubmitterProps {
  timeSlots: TimeSlot[];
  selectedTimeSlots: Map<string, {slot: TimeSlot, startTime: string, endTime: string}>;
  creatorName: string;
  responderName: string;
  inviteId: string | undefined;
  onSubmit: () => Promise<void>;
  onCannotMakeIt: (e: React.MouseEvent) => void;
}

const ResponseSubmitter: React.FC<ResponseSubmitterProps> = ({
  timeSlots,
  selectedTimeSlots,
  creatorName,
  responderName,
  inviteId,
  onSubmit,
  onCannotMakeIt
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 space-y-4">
      <Button 
        onClick={handleSubmit}
        disabled={selectedTimeSlots.size === 0 || isSubmitting}
        className="w-full py-6 text-base"
      >
        Submit your availability
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      
      <button
        onClick={onCannotMakeIt}
        className="w-full text-gray-500 text-sm hover:text-gray-700 transition-colors"
      >
        I can't make any of these times
      </button>
    </div>
  );
};

export default ResponseSubmitter;
