
// src/context/meeting/operations/meetingOperations.ts
import { Meeting } from '@/types';
import { MeetingContextState } from '../types';
import { setMeetingNotes as dbSetMeetingNotes, getMeetingById } from '@/integrations/supabase/api';

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

export const useMeetingOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
) => {
  const { 
    setMeetingNotes,
    setParticipants,
    setTimeSlots,
    setSelectedTimeSlot,
    setLocations,
    setSelectedLocation,
    setCurrentMeetingId,
    setIsLoading,
    setError,
    setCurrentUser
  } = stateSetters;

  const { currentMeetingId, meetingNotes } = state;

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

  const loadMeetingFromStorage = async (id: string): Promise<Meeting | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const meeting = await getMeetingById(id);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.creator) {
        setCurrentUser(meeting.creator);
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

  const getMeetingData = () => {
    if (!state.currentUser) return {};
    
    return {
      creator: state.currentUser,
      participants: state.participants,
      timeSlots: state.timeSlots,
      selectedTimeSlot: state.selectedTimeSlot,
      locations: state.locations,
      selectedLocation: state.selectedLocation,
      notes: state.meetingNotes,
      status: state.selectedLocation ? 'confirmed' : state.selectedTimeSlot ? 'pending' : 'draft'
    };
  };

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

  return {
    setMeetingNotes: setMeetingNotesWithDB,
    loadMeetingFromStorage,
    getMeetingData,
    clearMeetingData
  };
};
