
// src/context/meeting/timeSlotOperations.ts
import { TimeSlot } from '@/types';
import { MeetingContextState, TimeSlotOperations } from './types';
import { addTimeSlots, addTimeResponse, setSelectedTimeSlot as dbSetSelectedTimeSlot, updateMeetingStatus } from '@/integrations/supabase/api';

type StateSetters = {
  setTimeSlots: (timeSlots: TimeSlot[]) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  [key: string]: any;
};

export const useTimeSlotOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
): TimeSlotOperations => {
  const { 
    setTimeSlots, 
    setSelectedTimeSlot, 
    setIsLoading, 
    setError 
  } = stateSetters;
  
  const { timeSlots, currentMeetingId } = state;

  const addTimeSlot = async (timeSlot: TimeSlot) => {
    if (!currentMeetingId) {
      setTimeSlots([...timeSlots, { ...timeSlot, id: timeSlot.id || crypto.randomUUID() }]);
      return;
    }

    try {
      const timeSlotId = await addTimeSlots([{
        meeting_id: currentMeetingId,
        date: timeSlot.date,
        start_time: timeSlot.startTime,
        end_time: timeSlot.endTime
      }]);

      if (!timeSlotId || timeSlotId.length === 0) {
        throw new Error('Failed to add time slot');
      }

      setTimeSlots([...timeSlots, { ...timeSlot, id: timeSlotId[0] }]);
    } catch (err) {
      console.error('Error adding time slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to add time slot');
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
  };

  const clearTimeSlots = () => {
    setTimeSlots([]);
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(ts => 
      ts.id === id ? { ...ts, ...updates } : ts
    ));
  };

  const setSelectedTimeSlotWithDB = async (timeSlot: TimeSlot | null) => {
    setSelectedTimeSlot(timeSlot);
    
    if (currentMeetingId && timeSlot) {
      try {
        await dbSetSelectedTimeSlot(currentMeetingId, timeSlot.id);
        await updateMeetingStatus(currentMeetingId, 'pending');
      } catch (err) {
        console.error('Error setting selected time slot:', err);
      }
    }
  };

  const respondToTimeSlot = async (timeSlotId: string, responderName: string, startTime: string, endTime: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const success = await addTimeResponse({
        time_slot_id: timeSlotId,
        responder_name: responderName,
        start_time: startTime,
        end_time: endTime
      });

      if (!success) {
        throw new Error('Failed to add time response');
      }

      // Update the timeSlots state with the new response
      const updatedTimeSlots = timeSlots.map(slot => {
        if (slot.id === timeSlotId) {
          const responses = slot.responses || [];
          return {
            ...slot,
            responses: [
              ...responses,
              {
                responderName,
                startTime,
                endTime
              }
            ]
          };
        }
        return slot;
      });
      
      setTimeSlots(updatedTimeSlots);

      return true;
    } catch (err) {
      console.error('Error responding to time slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to respond to time slot');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addTimeSlot,
    removeTimeSlot,
    clearTimeSlots,
    updateTimeSlot,
    setSelectedTimeSlot: setSelectedTimeSlotWithDB,
    respondToTimeSlot
  };
};
