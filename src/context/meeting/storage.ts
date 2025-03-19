
// src/context/meeting/storage.ts
import { Meeting } from '@/types';
import { StoredMeeting } from './types';
import { supabase } from '@/integrations/supabase/client';

// Flag to track if demo data has been initialized
let demoDataInitialized = false;

// Initialize demo data
export const initializeDemoData = async () => {
  // Only initialize once per session
  if (demoDataInitialized) {
    console.log("Demo data already initialized, skipping");
    return;
  }
  
  console.log("Initializing demo data in localStorage");
  demoDataInitialized = true;

  // Initialize Abby's demo data
  const abbyDemoData: Partial<StoredMeeting> = {
    creator: {
      id: "abby-id",
      name: "Abby",
      initial: "A"
    },
    timeSlots: [
      {
        id: "1",
        date: "March 1",
        startTime: "8:00 AM",
        endTime: "1:30 PM",
        responses: []
      },
      {
        id: "2",
        date: "March 2",
        startTime: "7:00 AM",
        endTime: "10:00 AM",
        responses: []
      },
      {
        id: "3",
        date: "March 3",
        startTime: "9:00 AM",
        endTime: "9:00 PM",
        responses: []
      }
    ],
    status: "draft" as const
  };
  
  // Store Abby's demo data
  await storeMeetingInStorage("demo_invite", abbyDemoData);
  
  // Initialize Burt's demo data (with Abby as the creator)
  const burtDemoData: Partial<StoredMeeting> = {
    creator: {
      id: "abby-id",
      name: "Abby",
      initial: "A"
    },
    timeSlots: [
      {
        id: "1",
        date: "March 1",
        startTime: "8:00 AM",
        endTime: "1:30 PM",
        responses: []
      },
      {
        id: "2",
        date: "March 2",
        startTime: "7:00 AM",
        endTime: "10:00 AM",
        responses: []
      },
      {
        id: "3",
        date: "March 3",
        startTime: "9:00 AM",
        endTime: "9:00 PM",
        responses: []
      }
    ],
    status: "draft" as const
  };
  
  // Store Burt's demo data
  await storeMeetingInStorage("burt_demo", burtDemoData);
  
  // Initialize Carrie's demo data
  const carrieDemoData: Partial<StoredMeeting> = {
    creator: {
      id: "abby-id",
      name: "Abby",
      initial: "A"
    },
    timeSlots: [
      {
        id: "1",
        date: "2023-03-15",
        startTime: "3:00 PM",
        endTime: "5:00 PM",
        responses: [
          {
            responderName: "Burt",
            startTime: "3:30 PM",
            endTime: "5:00 PM"
          }
        ]
      }
    ],
    status: "pending" as const
  };
  
  // Store Carrie's demo data
  await storeMeetingInStorage("carrie_demo", carrieDemoData);
  
  console.log("Demo data initialization complete");
};

// Store meeting data in local storage for demo purposes, or in Supabase in production
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

// Load meeting data from storage
export const loadMeetingFromStorage = async (id: string): Promise<Meeting | null> => {
  try {
    // Always check local storage first for demo IDs
    if (id === "demo_invite" || id === "burt_demo" || id === "carrie_demo") {
      const storedMeeting = localStorage.getItem(`meeting_${id}`);
      
      if (storedMeeting) {
        console.log(`Loaded demo meeting data for ID: ${id} from localStorage`);
        return JSON.parse(storedMeeting) as Meeting;
      }
      
      // If not found in localStorage but is a demo ID, 
      // initialize demo data and try again
      if (!demoDataInitialized) {
        console.log(`Demo data not initialized yet, initializing for ${id}`);
        await initializeDemoData();
        const freshStoredMeeting = localStorage.getItem(`meeting_${id}`);
        
        if (freshStoredMeeting) {
          console.log(`Loaded fresh demo meeting data for ID: ${id}`);
          return JSON.parse(freshStoredMeeting) as Meeting;
        }
      }
      
      // Create fallback data for demo IDs if still not found
      console.log(`Creating fallback meeting data for demo ID: ${id}`);
      return {
        id,
        creator: {
          id: "abby-id",
          name: "Abby",
          initial: "A"
        },
        timeSlots: [
          {
            id: "1",
            date: "March 15",
            startTime: "3:00 PM",
            endTime: "5:00 PM",
            responses: []
          },
          {
            id: "2",
            date: "March 16",
            startTime: "2:00 PM",
            endTime: "4:00 PM",
            responses: []
          }
        ],
        participants: [],
        locations: [],
        status: "draft"
      };
    }
    
    // For non-demo IDs, try to load from Supabase
    // But don't attempt to load demo IDs from Supabase as they're not valid UUIDs
    if (id !== "demo_invite" && id !== "burt_demo" && id !== "carrie_demo") {
      try {
        // Try to get from Supabase if it's a valid UUID
        const { data, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (data && !error) {
          console.log(`Loaded meeting data for ID: ${id} from Supabase`);
          // Transform Supabase data to Meeting type
          return {
            id: data.id,
            creator: {
              id: `creator-${data.id}`,
              name: data.creator_name,
              initial: data.creator_initial
            },
            timeSlots: [], // You would load these from related tables
            status: data.status
          } as Meeting;
        }
      } catch (supabaseError) {
        console.log("Error loading from Supabase:", supabaseError);
        // Continue to check localStorage as fallback
      }
    }
    
    console.log(`No meeting data found for ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return null;
  }
};
