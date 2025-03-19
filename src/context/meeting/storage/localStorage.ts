
// src/context/meeting/storage/localStorage.ts
import { StoredMeeting } from '../types';

// Store meeting data in local storage
export const storeMeetingInStorage = async (id: string, meeting: Partial<StoredMeeting>): Promise<boolean> => {
  try {
    // Store in local storage for easy demo access
    localStorage.setItem(`meeting_${id}`, JSON.stringify(meeting));
    
    console.log(`Stored meeting data for ID: ${id}`);
    
    return true;
  } catch (error) {
    console.error('Error storing meeting data:', error);
    return false;
  }
};

// Load meeting data from localStorage
export const loadMeetingFromLocalStorage = async (id: string): Promise<StoredMeeting | null> => {
  try {
    const storedMeeting = localStorage.getItem(`meeting_${id}`);
    
    if (storedMeeting) {
      console.log(`Loaded meeting data for ID: ${id} from localStorage`);
      return JSON.parse(storedMeeting) as StoredMeeting;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading meeting data from localStorage:', error);
    return null;
  }
};
