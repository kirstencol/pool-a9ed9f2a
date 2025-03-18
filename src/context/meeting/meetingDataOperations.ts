
// src/context/meeting/meetingDataOperations.ts
import { MeetingContextState, MeetingDataOperations } from './types';
import { useMeetingOperations } from './operations/meetingOperations';
import { useLinkOperations } from './operations/linkOperations';
import { useStorageOperations } from './operations/storageOperations';

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
  console.log("Initializing meetingDataOperations with time slots:", state.timeSlots.length);
  
  // Get operations from each specialized hook
  const meetingOps = useMeetingOperations(state, stateSetters);
  const linkOps = useLinkOperations(state, stateSetters);
  const storageOps = useStorageOperations(state, stateSetters);

  // Combine all operations into one object
  return {
    setMeetingNotes: meetingOps.setMeetingNotes,
    clearMeetingData: meetingOps.clearMeetingData,
    getMeetingData: meetingOps.getMeetingData,
    generateShareableLink: linkOps.generateShareableLink,
    loadMeetingFromStorage: meetingOps.loadMeetingFromStorage,
    storeMeetingInStorage: storageOps.storeMeetingInStorage
  };
};
