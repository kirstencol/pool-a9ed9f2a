
// src/context/meeting/operations/linkOperations.ts
import { MeetingContextState } from '../types';
import { createMeeting, addParticipants, addTimeSlots } from '@/integrations/supabase/api';

type StateSetters = {
  setCurrentMeetingId: (id: string) => void;
  setTimeSlots: (timeSlots: any[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  [key: string]: any;
};

export const useLinkOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
) => {
  const { 
    setCurrentMeetingId,
    setTimeSlots,
    setIsLoading,
    setError
  } = stateSetters;

  const { 
    currentUser, 
    participants, 
    timeSlots
  } = state;

  const generateShareableLink = async () => {
    if (state.currentMeetingId) {
      const baseUrl = window.location.origin;
      const shareableUrl = `${baseUrl}/respond/${state.currentMeetingId}`;
      return { id: state.currentMeetingId, url: shareableUrl };
    }

    if (!currentUser) {
      setError('No current user set');
      return { id: '', url: '' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const meetingId = await createMeeting({
        creator_name: currentUser.name,
        creator_initial: currentUser.initial,
        status: 'draft'
      });

      if (!meetingId) {
        throw new Error('Failed to create meeting');
      }

      setCurrentMeetingId(meetingId);

      const allParticipants = [currentUser, ...participants];
      const participantsInsert = allParticipants.map(p => ({
        meeting_id: meetingId,
        name: p.name,
        initial: p.initial
      }));

      const participantsAdded = await addParticipants(participantsInsert);
      if (!participantsAdded) {
        throw new Error('Failed to add participants');
      }

      if (timeSlots.length > 0) {
        const timeSlotsInsert = timeSlots.map(slot => ({
          meeting_id: meetingId,
          date: slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime
        }));

        const timeSlotIds = await addTimeSlots(timeSlotsInsert);
        if (!timeSlotIds) {
          throw new Error('Failed to add time slots');
        }

        const updatedTimeSlots = timeSlots.map((slot, index) => ({
          ...slot,
          id: timeSlotIds[index]
        }));
        setTimeSlots(updatedTimeSlots);
      }

      const baseUrl = window.location.origin;
      const shareableUrl = `${baseUrl}/respond/${meetingId}`;

      return { id: meetingId, url: shareableUrl };
    } catch (err) {
      console.error('Error generating shareable link:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { id: '', url: '' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateShareableLink
  };
};
