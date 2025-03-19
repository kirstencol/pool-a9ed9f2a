
// src/context/meeting/storage/demoData.ts
import { StoredMeeting } from '../types';
import { storeMeetingInStorage } from './localStorage';

// Flag to track if demo data has been initialized
let demoDataInitialized = false;

// Initialize demo data
export const initializeDemoData = async (): Promise<void> => {
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

// Check if this is a demo ID
export const isDemoId = (id: string): boolean => {
  return id === "demo_invite" || id === "burt_demo" || id === "carrie_demo";
};

// Create fallback demo meeting when needed
export const createFallbackDemoMeeting = (id: string) => {
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
};
