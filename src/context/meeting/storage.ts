
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
export const initializeDemoData = (): void => {
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
  
  // Check if demo data already exists
  const existingDemoData = loadMeetingFromStorage("demo_invite");
  const existingBurtData = loadMeetingFromStorage("burt_demo");
  
  // Store demo_invite data (always refresh it to ensure it's valid)
  storeMeetingInStorage("demo_invite", demoMeetingData);
  console.log("Demo meeting data initialized/refreshed in localStorage");
  
  // Also initialize/refresh burt_demo data
  storeMeetingInStorage("burt_demo", demoMeetingData);
  console.log("Burt demo meeting data initialized/refreshed in localStorage");
  
  // Log whether we updated existing data or created new data
  if (existingDemoData) {
    console.log("Updated existing demo_invite data in localStorage");
  } else {
    console.log("Created new demo_invite data in localStorage");
  }
  
  if (existingBurtData) {
    console.log("Updated existing burt_demo data in localStorage");
  } else {
    console.log("Created new burt_demo data in localStorage");
  }
};

export const ensureDemoDataExists = (): Promise<boolean> => {
  return new Promise((resolve) => {
    console.log("Ensuring demo data exists...");
    
    // Check if demo data exists
    const demoData = loadMeetingFromStorage("demo_invite");
    const burtData = loadMeetingFromStorage("burt_demo");
    
    // If both demo data points exist and have time slots, we're good
    if (demoData?.timeSlots?.length > 0 && burtData?.timeSlots?.length > 0) {
      console.log("Demo data already exists and is valid", {demoData, burtData});
      resolve(true);
      return;
    }
    
    // Initialize demo data
    console.log("Demo data missing or invalid, initializing now");
    initializeDemoData();
    
    // Verify after initialization
    setTimeout(() => {
      const verifyDemoData = loadMeetingFromStorage("demo_invite");
      const verifyBurtData = loadMeetingFromStorage("burt_demo");
      
      console.log("Verification after initialization:", {
        demoDataExists: !!verifyDemoData?.timeSlots?.length,
        burtDataExists: !!verifyBurtData?.timeSlots?.length,
        demoData: verifyDemoData,
        burtData: verifyBurtData
      });
      
      resolve(!!verifyDemoData?.timeSlots?.length || !!verifyBurtData?.timeSlots?.length);
    }, 100);
  });
};
