
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

// Flag to track initialization
let initializationStarted = false;

// Re-export demo data initialization
export { initializeDemoData, isDemoId } from './demoData';

// Re-export the storage function for external use
export const storeMeetingInStorage = storeInLocalStorage;

// Initialize demo data if needed
const ensureDemoDataInitialized = async () => {
  if (initializationStarted) return;
  
  initializationStarted = true;
  await initializeDemoData();
};

// Load meeting data from storage
export const loadMeetingFromStorage = async (id: string): Promise<Meeting | null> => {
  try {
    // For demo IDs, check cache first for instant response
    if (isDemoId(id) && demoMeetingsCache.has(id)) {
      console.log(`Returning cached demo meeting for ID: ${id}`);
      return demoMeetingsCache.get(id) || null;
    }
    
    // For demo IDs, ensure we've initialized the data
    if (isDemoId(id)) {
      await ensureDemoDataInitialized();
    }
    
    // Always check local storage first for any ID
    const storedMeeting = await loadMeetingFromLocalStorage(id);
    
    if (storedMeeting) {
      console.log(`Loaded meeting data for ID: ${id} from localStorage`);
      
      // Cache demo meetings for faster access
      if (isDemoId(id)) {
        demoMeetingsCache.set(id, storedMeeting);
      }
      
      return storedMeeting;
    }
    
    // For non-demo IDs, try to load from Supabase
    if (!isDemoId(id)) {
      const supabaseMeeting = await loadMeetingFromSupabase(id);
      
      if (supabaseMeeting) {
        return supabaseMeeting;
      }
    }
    
    // Create fallback data for demo IDs if still not found
    if (isDemoId(id)) {
      const fallbackMeeting = createFallbackDemoMeeting(id);
      demoMeetingsCache.set(id, fallbackMeeting);
      return fallbackMeeting;
    }
    
    console.log(`No meeting data found for ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    
    // For demo IDs, always return fallback data on error
    if (isDemoId(id)) {
      const fallbackMeeting = createFallbackDemoMeeting(id);
      return fallbackMeeting;
    }
    
    return null;
  }
};
