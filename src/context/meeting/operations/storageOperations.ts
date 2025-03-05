
// src/context/meeting/operations/storageOperations.ts
import { Meeting } from '@/types';
import { MeetingContextState, StoredMeeting } from '../types';
import { storeMeetingInStorage as storeMeetingToStorage } from '../storage';

type StateSetters = {
  setError: (error: string | null) => void;
  [key: string]: any;
};

export const useStorageOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
) => {
  const { setError } = stateSetters;

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
    storeMeetingInStorage
  };
};
