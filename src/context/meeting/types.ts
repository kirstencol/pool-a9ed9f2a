
// src/context/meeting/types.ts
import { User, TimeSlot, Location, Meeting } from '@/types';

export interface StoredMeeting {
  id?: string;
  creator?: User;
  participants?: User[];
  timeSlots?: TimeSlot[];
  selectedTimeSlot?: TimeSlot | null;
  locations?: Location[];
  selectedLocation?: Location | null;
  notes?: string;
  status?: 'draft' | 'pending' | 'confirmed';
  responses?: any[];
}

// Core context state and operations
export interface MeetingContextState {
  currentUser: User | null;
  participants: User[];
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  locations: Location[];
  selectedLocation: Location | null;
  meetingNotes: string;
  currentMeetingId: string;
  isLoading: boolean;
  error: string | null;
}

// User-related operations
export interface UserOperations {
  setCurrentUser: (user: User) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
}

// Time slot operations
export interface TimeSlotOperations {
  addTimeSlot: (timeSlot: TimeSlot) => void;
  addTimeSlotsBatch: (timeSlots: TimeSlot[]) => Promise<TimeSlot[]>;
  removeTimeSlot: (id: string) => void;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void;
  clearTimeSlots: () => void;
  respondToTimeSlot: (timeSlotId: string, responderName: string, startTime: string, endTime: string) => Promise<boolean>;
}

// Location operations
export interface LocationOperations {
  addLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
  setSelectedLocation: (location: Location | null) => void;
  respondToLocation: (locationId: string, responderName: string, note?: string) => Promise<boolean>;
}

// Meeting data operations
export interface MeetingDataOperations {
  setMeetingNotes: (notes: string) => void;
  clearMeetingData: () => void;
  getMeetingData: () => Partial<Meeting>;
  generateShareableLink: () => Promise<{ id: string, url: string }>;
  loadMeetingFromStorage: (id: string) => Promise<Meeting | null>;
  storeMeetingInStorage: (id: string, meeting: Partial<StoredMeeting>) => Promise<boolean>;
}

// Complete context type combining all operations
export interface MeetingContextType extends 
  MeetingContextState, 
  UserOperations,
  TimeSlotOperations,
  LocationOperations,
  MeetingDataOperations {}
