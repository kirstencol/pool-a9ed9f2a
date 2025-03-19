
// src/context/meeting/operations/meetingOperations.ts
import { Meeting } from '@/types';
import { MeetingContextState } from '../types';
import { loadMeetingFromStorage as loadMeetingFromLocalStorage } from '../storage';
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
      // First check if this is a demo ID
      if (id === "demo_invite" || id === "burt_demo" || id === "carrie_demo") {
        console.log("Loading demo meeting:", id);
        const meeting = await loadMeetingFromLocalStorage(id);
        
        if (meeting) {
          if (meeting.creator) {
            setCurrentUser(meeting.creator);
          }
          
          setParticipants(meeting.participants || []);
          setTimeSlots(meeting.timeSlots || []);
          setSelectedTimeSlot(meeting.selectedTimeSlot);
          setLocations(meeting.locations || []);
          setSelectedLocation(meeting.selectedLocation);
          setMeetingNotes(meeting.notes || '');
          setCurrentMeetingId(id);
          
          setIsLoading(false);
          return meeting as Meeting;
        }
      }
      
      // For non-demo IDs, try to load from Supabase
      if (id !== "demo_invite" && id !== "burt_demo" && id !== "carrie_demo") {
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
          
          setIsLoading(false);
          return meeting;
        } catch (supabaseError) {
          console.error('Error loading meeting from Supabase:', supabaseError);
          // Fall through to try localStorage
        }
      }
      
      // Final fallback for any ID: try localStorage
      const localMeeting = await loadMeetingFromLocalStorage(id);
      
      if (localMeeting) {
        if (localMeeting.creator) {
          setCurrentUser(localMeeting.creator);
        }
        
        setParticipants(localMeeting.participants || []);
        setTimeSlots(localMeeting.timeSlots || []);
        setSelectedTimeSlot(localMeeting.selectedTimeSlot);
        setLocations(localMeeting.locations || []);
        setSelectedLocation(localMeeting.selectedLocation);
        setMeetingNotes(localMeeting.notes || '');
        setCurrentMeetingId(id);
        
        setIsLoading(false);
        return localMeeting as Meeting;
      }
      
      throw new Error('Meeting not found');
    } catch (err) {
      console.error('Error loading meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting');
      setIsLoading(false);
      return null;
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
      status: state.selectedLocation ? 'confirmed' as const : state.selectedTimeSlot ? 'pending' as const : 'draft' as const
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
