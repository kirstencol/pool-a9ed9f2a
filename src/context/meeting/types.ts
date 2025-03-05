
import { User, TimeSlot, Location, Meeting } from '@/types';

export interface StoredMeeting {
  id?: string;
  creator?: User;
  timeSlots?: TimeSlot[];
  selectedTimeSlot?: TimeSlot | null;
  locations?: Location[];
  selectedLocation?: Location | null;
  notes?: string;
  responses?: {
    responderName: string;  // Changed from 'name' to 'responderName' for consistency
    timeSlotId: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface MeetingContextType {
  currentUser: User | null;
  setCurrentUser: (user: User) => void;
  participants: User[];
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  timeSlots: TimeSlot[];
  addTimeSlot: (timeSlot: TimeSlot) => void;
  removeTimeSlot: (id: string) => void;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  selectedTimeSlot: TimeSlot | null;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  locations: Location[];
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  selectedLocation: Location | null;
  setSelectedLocation: (location: Location | null) => void;
  meetingNotes: string;
  setMeetingNotes: (notes: string) => void;
  clearMeetingData: () => void;
  clearTimeSlots: () => void;
  getMeetingData: () => Partial<Meeting>;
  generateShareableLink: () => { id: string, url: string };
  storeMeetingInStorage: (id: string, meeting: StoredMeeting) => void;
  loadMeetingFromStorage: (id: string) => StoredMeeting | null;
}
