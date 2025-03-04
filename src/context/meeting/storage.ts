
import { StoredMeeting } from './types';

export const STORAGE_KEY_PREFIX = 'meetup_app_';

export const storeMeetingInStorage = (id: string, meeting: StoredMeeting): boolean => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
    localStorage.setItem(storageKey, JSON.stringify(meeting));
    console.log(`Meeting data stored with key: ${storageKey}`);
    return true;
  } catch (error) {
    console.error('Error storing meeting data:', error);
    return false;
  }
};

export const loadMeetingFromStorage = (id: string): StoredMeeting | null => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (!storedData) {
      console.log(`No data found for key: ${storageKey}`);
      return null;
    }
    
    const parsedData = JSON.parse(storedData) as StoredMeeting;
    console.log(`Successfully loaded data for key: ${storageKey}`, parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return null;
  }
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

// Demo time slots that we'll use for demonstration purposes
const DEMO_TIME_SLOTS = [
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
];

// Initialize demo meeting data in localStorage
export const initializeDemoData = (): boolean => {
  try {
    console.log("Initializing demo data...");
    
    // Create the default demo creator
    const demoCreator = {
      id: "demo-creator",
      name: "Abby",
      initial: "A"
    };
    
    // Always create fresh demo data to ensure it exists and is valid
    const demoMeetingData: StoredMeeting = {
      creator: demoCreator,
      timeSlots: DEMO_TIME_SLOTS,
    };
    
    // Force store both sets of demo data
    const demoStored = storeMeetingInStorage("demo_invite", demoMeetingData);
    const burtStored = storeMeetingInStorage("burt_demo", demoMeetingData);
    
    console.log("Demo data initialization complete. Success:", demoStored && burtStored);
    
    // Verify data was stored properly
    const demoVerify = loadMeetingFromStorage("demo_invite");
    const burtVerify = loadMeetingFromStorage("burt_demo");
    
    // Log verification results
    if (demoVerify && demoVerify.timeSlots && demoVerify.timeSlots.length > 0) {
      console.log("Demo data verified with", demoVerify.timeSlots.length, "time slots");
    } else {
      console.error("Failed to verify demo data");
    }
    
    if (burtVerify && burtVerify.timeSlots && burtVerify.timeSlots.length > 0) {
      console.log("Burt data verified with", burtVerify.timeSlots.length, "time slots");
    } else {
      console.error("Failed to verify Burt demo data");
    }
    
    return demoStored && burtStored;
  } catch (error) {
    console.error("Error in initializeDemoData:", error);
    return false;
  }
};
