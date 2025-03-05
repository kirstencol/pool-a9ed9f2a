
// src/integrations/supabase/api/index.ts
// Export all API functions from a central point

// Export types
export * from './types';

// Export meeting functions
export {
  createMeeting,
  getMeetingById,
  updateMeetingStatus,
  setMeetingNotes
} from './meetings';

// Export participant functions
export {
  addParticipants,
  getParticipantsByMeetingId
} from './participants';

// Export time slot functions
export {
  addTimeSlots,
  addTimeResponse,
  getTimeSlotsByMeetingId,
  setSelectedTimeSlot
} from './timeSlots';

// Export location functions
export {
  addLocation,
  addLocationResponse,
  getLocationsByMeetingId,
  setSelectedLocation
} from './locations';
