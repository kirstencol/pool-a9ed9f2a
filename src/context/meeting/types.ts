// src/context/meeting/types.ts
import { User, TimeSlot, Location, Meeting } from '@/types';

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
  generateShareableLink: () => Promise<{ id: string, url: string }>;
  loadMeetingFromStorage: (id: string) => Promise<Meeting | null>;
  respondToTimeSlot: (timeSlotId: string, responderName: string, startTime: string, endTime: string) => Promise<boolean>;
  respondToLocation: (locationId: string, responderName: string, note?: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}
