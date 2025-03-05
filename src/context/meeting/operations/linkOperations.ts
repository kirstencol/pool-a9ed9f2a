
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
    // If we already have a meeting ID, just return the shareable link
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
      // Create the meeting first
      const meetingId = await createMeeting({
        creator_name: currentUser.name,
        creator_initial: currentUser.initial,
        status: 'draft'
      });

      if (!meetingId) {
        throw new Error('Failed to create meeting');
      }

      // Set the meeting ID in the context
      setCurrentMeetingId(meetingId);
      console.log("Created meeting with ID:", meetingId);

      // Add all participants (including the current user)
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

      // Add time slots if any exist - IMPORTANT: All with the same meeting_id
      if (timeSlots.length > 0) {
        console.log("Preparing to insert time slots with meeting ID:", meetingId);
        console.log("Time slots to insert:", timeSlots);
        
        // Ensure all time slots use the same meeting_id
        const timeSlotsInsert = timeSlots.map(slot => ({
          meeting_id: meetingId, // Use the same meeting ID for all slots
          date: slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime
        }));

        const timeSlotIds = await addTimeSlots(timeSlotsInsert);
        if (!timeSlotIds) {
          throw new Error('Failed to add time slots');
        }

        // Update the time slots in context with the new IDs
        const updatedTimeSlots = timeSlots.map((slot, index) => ({
          ...slot,
          id: timeSlotIds[index]
        }));
        setTimeSlots(updatedTimeSlots);
        console.log("Successfully added time slots with IDs:", timeSlotIds);
      }

      // Generate the shareable URL
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
