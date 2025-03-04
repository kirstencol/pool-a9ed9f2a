
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
    
    if (!storedData) return null;
    
    return JSON.parse(storedData) as StoredMeeting;
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
export const initializeDemoData = (): void => {
  // Check if demo data already exists
  const existingDemoData = loadMeetingFromStorage("demo_invite");
  
  // Only create the demo data if it doesn't exist yet
  if (!existingDemoData) {
    const demoMeetingData: StoredMeeting = {
      creator: {
        id: "demo-creator",
        name: "Abby",
        initial: "A"
      },
      timeSlots: DEMO_TIME_SLOTS,
    };
    
    storeMeetingInStorage("demo_invite", demoMeetingData);
    console.log("Demo meeting data initialized in localStorage");
    
    // Also initialize burt_demo data
    storeMeetingInStorage("burt_demo", demoMeetingData);
    console.log("Burt demo meeting data initialized in localStorage");
  } else {
    console.log("Demo data already exists in localStorage");
  }
};
