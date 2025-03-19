
// src/context/meeting/storage/localStorage.ts
import { StoredMeeting } from '../types';
import { Meeting } from '@/types';

// Store meeting data in local storage
export const storeMeetingInStorage = async (id: string, meeting: Partial<StoredMeeting>): Promise<boolean> => {
  try {
    // Make sure status is correctly typed before storing
    const typedMeeting = {
      ...meeting,
      status: meeting.status as "draft" | "pending" | "confirmed"
    };
    
    // Store in local storage with a proper key prefix
    localStorage.setItem(`meeting_${id}`, JSON.stringify(typedMeeting));
    
    console.log(`Stored meeting data for ID: ${id}`);
    
    return true;
  } catch (error) {
    console.error('Error storing meeting data:', error);
    return false;
  }
};

// Load meeting data from localStorage with proper typing
export const loadMeetingFromLocalStorage = async (id: string): Promise<Meeting | null> => {
  try {
    const storedMeeting = localStorage.getItem(`meeting_${id}`);
    
    if (storedMeeting) {
      console.log(`Loaded meeting data for ID: ${id} from localStorage`);
      
      // Parse and ensure status is properly typed
      const parsed = JSON.parse(storedMeeting);
      
      // Cast to Meeting type with the correct status type
      const typedMeeting: Meeting = {
        ...parsed,
        id, // Ensure id is set
        participants: parsed.participants || [],
        locations: parsed.locations || [],
        timeSlots: parsed.timeSlots || [],
        selectedTimeSlot: parsed.selectedTimeSlot || null,
        selectedLocation: parsed.selectedLocation || null,
        notes: parsed.notes || "",
        status: parsed.status as "draft" | "pending" | "confirmed"
      };
      
      return typedMeeting;
    }
    
    return null;
  } catch (error) {
    console.error('Error loading meeting data from localStorage:', error);
    return null;
  }
};
