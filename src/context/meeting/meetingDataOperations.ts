
// src/context/meeting/meetingDataOperations.ts
import { Meeting } from '@/types';
import { MeetingContextState, MeetingDataOperations, StoredMeeting } from './types';
import { 
  createMeeting, 
  addParticipants, 
  addTimeSlots, 
  getMeetingById,
  dbSetMeetingNotes
} from '@/integrations/supabase/api';
import { storeMeetingInStorage as storeMeetingToStorage } from './storage';

type StateSetters = {
  setCurrentUser: (user: any) => void;
  setParticipants: (participants: any[]) => void;
  setTimeSlots: (timeSlots: any[]) => void;
  setSelectedTimeSlot: (timeSlot: any) => void;
  setLocations: (locations: any[]) => void;
  setSelectedLocation: (location: any) => void;
  setMeetingNotes: (notes: string) => void;
  setCurrentMeetingId: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useMeetingDataOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
): MeetingDataOperations => {
  const { 
    setMeetingNotes,
    setParticipants,
    setTimeSlots,
    setSelectedTimeSlot,
    setLocations,
    setSelectedLocation,
    setCurrentMeetingId,
    setIsLoading,
    setError
  } = stateSetters;

  const { 
    currentUser, 
    participants, 
    timeSlots, 
    selectedTimeSlot, 
    locations, 
    selectedLocation, 
    meetingNotes, 
    currentMeetingId 
  } = state;

  const clearMeetingData = () => {
    setParticipants([]);
    setTimeSlots([]);
    setSelectedTimeSlot(null);
    setLocations([]);
    setSelectedLocation(null);
    setMeetingNotes('');
    setCurrentMeetingId('');
    setError(null);
  };

  const getMeetingData = (): Partial<Meeting> => {
    if (!currentUser) return {};
    
    return {
      creator: currentUser,
      participants,
      timeSlots,
      selectedTimeSlot,
      locations,
      selectedLocation,
      notes: meetingNotes,
      status: selectedLocation ? 'confirmed' : selectedTimeSlot ? 'pending' : 'draft'
    };
  };

  const generateShareableLink = async () => {
    if (currentMeetingId) {
      const baseUrl = window.location.origin;
      const shareableUrl = `${baseUrl}/respond/${currentMeetingId}`;
      return { id: currentMeetingId, url: shareableUrl };
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

  const loadMeetingFromStorage = async (id: string): Promise<Meeting | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const meeting = await getMeetingById(id);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.creator) {
        stateSetters.setCurrentUser(meeting.creator);
      }
      
      setParticipants(meeting.participants || []);
      setTimeSlots(meeting.timeSlots || []);
      setSelectedTimeSlot(meeting.selectedTimeSlot);
      setLocations(meeting.locations || []);
      setSelectedLocation(meeting.selectedLocation);
      setMeetingNotes(meeting.notes || '');
      setCurrentMeetingId(meeting.id);

      return meeting;
    } catch (err) {
      console.error('Error loading meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const setMeetingNotesWithDB = async (notes: string) => {
    setMeetingNotes(notes);
    
    if (currentMeetingId) {
      try {
        await dbSetMeetingNotes(currentMeetingId, notes);
      } catch (err) {
        console.error('Error setting meeting notes:', err);
      }
    }
  };

  const storeMeetingInStorage = async (id: string, meetingData: Partial<StoredMeeting>): Promise<boolean> => {
    try {
      return await storeMeetingToStorage(id, meetingData);
    } catch (error) {
      console.error('Error storing meeting data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error storing meeting data');
      return false;
    }
  };

  return {
    setMeetingNotes: setMeetingNotesWithDB,
    clearMeetingData,
    getMeetingData,
    generateShareableLink,
    loadMeetingFromStorage,
    storeMeetingInStorage
  };
};
