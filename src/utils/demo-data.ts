// src/utils/demo-data.ts
import { 
  createMeeting, 
  addParticipants, 
  addTimeSlots, 
  addTimeResponse, 
  addLocation,
  getMeetingById
} from '@/integrations/supabase/api';

// Demo time slots for Abby
const DEMO_TIME_SLOTS = [
  {
    date: "2024-03-01",
    start_time: "8:00 AM",
    end_time: "1:30 PM"
  },
  {
    date: "2024-03-02",
    start_time: "7:00 AM",
    end_time: "10:00 AM"
  },
  {
    date: "2024-03-03",
    start_time: "9:00 AM",
    end_time: "9:00 PM"
  }
];

// Time slots for Carrie's demo showing overlapping availability
const CARRIE_DEMO_TIME_SLOTS = [
  {
    date: "2024-03-01",
    start_time: "8:00 AM",
    end_time: "12:00 PM"
  },
  {
    date: "2024-03-02",
    start_time: "8:00 AM",
    end_time: "9:30 AM"
  }
];

// Initialize demo meetings data in Supabase
export const initializeDemoData = async (): Promise<boolean> => {
  try {
    console.log("Initializing demo data in Supabase...");
    
    // Create the demo meetings
    const demoMeetingId = await createDemoMeeting("demo_invite", "Abby");
    const burtDemoMeetingId = await createDemoMeeting("burt_demo", "Abby");
    const carrieDemoMeetingId = await createDemoMeeting("carrie_demo", "Abby and Burt");
    
    return !!(demoMeetingId && burtDemoMeetingId && carrieDemoMeetingId);
  } catch (error) {
    console.error("Error initializing demo data:", error);
    return false;
  }
};

// Helper function to create a demo meeting
async function createDemoMeeting(linkId: string, creatorName: string): Promise<string | null> {
  try {
    // Check if meeting already exists
    const existingMeeting = await getMeetingById(linkId);
    if (existingMeeting) {
      console.log(`Demo meeting ${linkId} already exists`);
      return linkId;
    }
    
    // Create the meeting with the specific ID
    const meetingId = await createMeeting({
      creator_name: creatorName,
      creator_initial: creatorName.charAt(0).toUpperCase(),
      status: 'draft'
    });
    
    if (!meetingId) {
      throw new Error(`Failed to create demo meeting ${linkId}`);
    }
    
    // Add participants
    await addParticipants([
      {
        meeting_id: meetingId,
        name: "Abby",
        initial: "A"
      },
      {
        meeting_id: meetingId,
        name: "Burt",
        initial: "B"
      },
      {
        meeting_id: meetingId,
        name: "Carrie",
        initial: "C"
      }
    ]);
    
    // Add appropriate time slots based on the demo type
    const timeSlots = linkId === "carrie_demo" ? CARRIE_DEMO_TIME_SLOTS : DEMO_TIME_SLOTS;
    
    const timeSlotIds = await addTimeSlots(
      timeSlots.map(slot => ({
        meeting_id: meetingId,
        ...slot
      }))
    );
    
    if (!timeSlotIds) {
      throw new Error(`Failed to add time slots for demo meeting ${linkId}`);
    }
    
    // For Carrie's demo, add Burt's responses
    if (linkId === "carrie_demo") {
      await addTimeResponse({
        time_slot_id: timeSlotIds[0],
        responder_name: "Burt",
        start_time: "8:00 AM",
        end_time: "12:00 PM"
      });
      
      await addTimeResponse({
        time_slot_id: timeSlotIds[1],
        responder_name: "Burt",
        start_time: "8:00 AM",
        end_time: "9:30 AM"
      });
    }
    
    // For demonstration, add sample locations for Burt demo
    if (linkId === "burt_demo") {
      await addLocation({
        meeting_id: meetingId,
        name: "Central Cafe",
        description: "Great coffee and shouldn't be too hard to get a table.",
        suggested_by: "Carrie"
      });
      
      await addLocation({
        meeting_id: meetingId,
        name: "Starbucks on 5th",
        description: "Not the best vibes, but central to all three of us. Plus, PSLs.",
        suggested_by: "Carrie"
      });
    }
    
    return meetingId;
  } catch (error) {
    console.error(`Error creating demo meeting ${linkId}:`, error);
    return null;
  }
}

// Function to get a demo meeting ID from a link ID
export const getDemoMeetingId = async (linkId: string): Promise<string | null> => {
  try {
    // First try to get the meeting directly
    const meeting = await getMeetingById(linkId);
    if (meeting) {
      return meeting.id;
    }
    
    // If not found, try to initialize demo data and get the meeting again
    await initializeDemoData();
    
    const refreshedMeeting = await getMeetingById(linkId);
    return refreshedMeeting?.id || null;
  } catch (error) {
    console.error(`Error getting demo meeting ID for ${linkId}:`, error);
    return null;
  }
};
