
import React from 'react';
import { TimeSlot } from "@/types";

interface OverlappingTimeSlotsProps {
  overlappingTimeSlots: any[];
}

const OverlappingTimeSlots = ({ overlappingTimeSlots }: OverlappingTimeSlotsProps) => {
  return (
    <div className="space-y-6 mb-10">
      {overlappingTimeSlots && overlappingTimeSlots.length > 0 ? (
        overlappingTimeSlots.map((timeSlot: any) => (
          <div key={timeSlot.id} className="space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
            <h2 className="text-xl font-medium">
              {timeSlot.date}
            </h2>
            <p className="text-lg">
              {timeSlot.overlapStartTime} - {timeSlot.overlapEndTime}
            </p>
          </div>
        ))
      ) : (
        <div className="space-y-1 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500">No overlapping time slots found</p>
        </div>
      )}
    </div>
  );
};

export default OverlappingTimeSlots;
