
// src/context/meeting/storage.ts
import { Meeting } from '@/types';
import { StoredMeeting } from './types';
import { supabase } from '@/integrations/supabase/client';

// Initialize demo data
export const initializeDemoData = () => {
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
  storeMeetingInStorage("demo_invite", abbyDemoData);
  
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
  storeMeetingInStorage("burt_demo", burtDemoData);
  
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
  storeMeetingInStorage("carrie_demo", carrieDemoData);
};

// Store meeting data in local storage for demo purposes, or in Supabase in production
export const storeMeetingInStorage = async (id: string, meeting: Partial<StoredMeeting>): Promise<boolean> => {
  try {
    // Store in local storage for easy demo access
    localStorage.setItem(`meeting_${id}`, JSON.stringify(meeting));
    
    // For demo purposes, we're using both localStorage and Supabase
    // In a real app, you'd choose one or the other depending on your needs
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
    // Try to load from local storage first (for demo purposes)
    const storedMeeting = localStorage.getItem(`meeting_${id}`);
    
    if (storedMeeting) {
      console.log(`Loaded meeting data for ID: ${id} from localStorage`);
      return JSON.parse(storedMeeting) as Meeting;
    }
    
    // If not found in local storage, return null for now
    // In a real app, you might try to load from a database instead
    console.log(`No meeting data found for ID: ${id}`);
    return null;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return null;
  }
};
