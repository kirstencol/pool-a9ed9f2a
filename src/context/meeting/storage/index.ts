
// src/context/meeting/storage/index.ts
import { Meeting } from '@/types';
import { StoredMeeting } from '../types';
import { 
  initializeDemoData, 
  isDemoId, 
  createFallbackDemoMeeting 
} from './demoData';
import { 
  storeMeetingInStorage as storeInLocalStorage,
  loadMeetingFromLocalStorage 
} from './localStorage';
import { loadMeetingFromSupabase } from './supabaseStorage';

// Create a cache for demo meetings to prevent flickering
const demoMeetingsCache = new Map<string, Meeting>();

// Re-export demo data initialization
export { initializeDemoData, isDemoId } from './demoData';

// Re-export the storage function for external use
export const storeMeetingInStorage = storeInLocalStorage;

// Load meeting data from storage
export const loadMeetingFromStorage = async (id: string): Promise<Meeting | null> => {
  try {
    // For demo IDs, check cache first for instant response
    if (isDemoId(id) && demoMeetingsCache.has(id)) {
      console.log(`Returning cached demo meeting for ID: ${id}`);
      return demoMeetingsCache.get(id) || null;
    }
    
    // Always check local storage first for demo IDs
    if (isDemoId(id)) {
      const storedMeeting = await loadMeetingFromLocalStorage(id);
      
      if (storedMeeting) {
        console.log(`Loaded demo meeting data for ID: ${id} from localStorage`);
        demoMeetingsCache.set(id, storedMeeting);
        return storedMeeting;
      }
      
      // If not found in localStorage but is a demo ID, 
      // initialize demo data and try again
      console.log(`Demo data not initialized yet, initializing for ${id}`);
      await initializeDemoData();
      const freshStoredMeeting = await loadMeetingFromLocalStorage(id);
      
      if (freshStoredMeeting) {
        console.log(`Loaded fresh demo meeting data for ID: ${id}`);
        demoMeetingsCache.set(id, freshStoredMeeting);
        return freshStoredMeeting;
      }
      
      // Create fallback data for demo IDs if still not found
      const fallbackMeeting = createFallbackDemoMeeting(id);
      demoMeetingsCache.set(id, fallbackMeeting);
      return fallbackMeeting;
    }
    
    // For non-demo IDs, try to load from Supabase
    if (!isDemoId(id)) {
      const supabaseMeeting = await loadMeetingFromSupabase(id);
      
      if (supabaseMeeting) {
        return supabaseMeeting;
      }
      
      // Try localStorage as fallback for non-demo IDs
      const localMeeting = await loadMeetingFromLocalStorage(id);
      if (localMeeting) {
        return localMeeting;
      }
    }
    
    console.log(`No meeting data found for ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return null;
  }
};
