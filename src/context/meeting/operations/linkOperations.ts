
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
    timeSlots,
    currentMeetingId
  } = state;

  // Generate a shareable link for an existing meeting
  const generateShareableUrl = (meetingId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/respond/${meetingId}`;
  };

  // Create a new meeting in the database
  const createNewMeeting = async (): Promise<string> => {
    if (!currentUser) {
      throw new Error('No current user set');
    }

    const meetingId = await createMeeting({
      creator_name: currentUser.name,
      creator_initial: currentUser.initial,
      status: 'draft'
    });

    if (!meetingId) {
      throw new Error('Failed to create meeting');
    }

    console.log("Created meeting with ID:", meetingId);
    return meetingId;
  };

  // Add participants to a meeting
  const addMeetingParticipants = async (meetingId: string): Promise<boolean> => {
    if (!currentUser) {
      throw new Error('No current user set');
    }

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
    return true;
  };

  // Add time slots to a meeting
  const addMeetingTimeSlots = async (meetingId: string): Promise<string[]> => {
    if (timeSlots.length === 0) {
      return [];
    }

    console.log("Preparing to insert time slots with meeting ID:", meetingId);
    console.log("Time slots to insert:", timeSlots);
    
    // Ensure all time slots use the same meeting_id
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

    console.log("Successfully added time slots with IDs:", timeSlotIds);
    return timeSlotIds;
  };

  // Update time slots with their newly created IDs
  const updateTimeSlotsWithIds = (slots: any[], ids: string[]): void => {
    const updatedTimeSlots = slots.map((slot, index) => ({
      ...slot,
      id: ids[index]
    }));
    setTimeSlots(updatedTimeSlots);
  };

  // Main function to generate a shareable link
  const generateShareableLink = async () => {
    // If we already have a meeting ID, just return the shareable link
    if (currentMeetingId) {
      return { 
        id: currentMeetingId, 
        url: generateShareableUrl(currentMeetingId) 
      };
    }

    if (!currentUser) {
      setError('No current user set');
      return { id: '', url: '' };
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Create the meeting
      const meetingId = await createNewMeeting();
      setCurrentMeetingId(meetingId);

      // Step 2: Add participants
      await addMeetingParticipants(meetingId);

      // Step 3: Add time slots if any exist
      if (timeSlots.length > 0) {
        const timeSlotIds = await addMeetingTimeSlots(meetingId);
        updateTimeSlotsWithIds(timeSlots, timeSlotIds);
      }

      // Step 4: Generate the shareable URL
      const shareableUrl = generateShareableUrl(meetingId);

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
