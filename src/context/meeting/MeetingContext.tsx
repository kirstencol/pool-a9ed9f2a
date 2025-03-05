
// src/context/meeting/MeetingContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, TimeSlot, Location } from '@/types';
import { MeetingContextType, MeetingContextState } from './types';
import { useUserOperations } from './userOperations';
import { useTimeSlotOperations } from './timeSlotOperations';
import { useLocationOperations } from './locationOperations';
import { useMeetingDataOperations } from './meetingDataOperations';

// Create context with undefined default value
const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  console.log("MeetingProvider initializing"); // Debug log
  
  // Core state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [meetingNotes, setMeetingNotes] = useState<string>('');
  const [currentMeetingId, setCurrentMeetingId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Log initialization for debugging
  useEffect(() => {
    console.log("MeetingProvider mounted");
    return () => console.log("MeetingProvider unmounted");
  }, []);

  // Core state object
  const state: MeetingContextState = {
    currentUser,
    participants,
    timeSlots,
    selectedTimeSlot,
    locations,
    selectedLocation,
    meetingNotes,
    currentMeetingId,
    isLoading,
    error
  };

  // State setters
  const stateSetters = {
    setCurrentUser,
    setParticipants,
    setTimeSlots,
    setSelectedTimeSlot,
    setLocations,
    setSelectedLocation,
    setMeetingNotes,
    setCurrentMeetingId,
    setIsLoading,
    setError
  };

  // Include operation hooks
  const userOps = useUserOperations(state, stateSetters);
  const timeSlotOps = useTimeSlotOperations(state, stateSetters);
  const locationOps = useLocationOperations(state, stateSetters);
  const meetingDataOps = useMeetingDataOperations(state, stateSetters);

  // Combined context value
  const contextValue: MeetingContextType = {
    ...state,
    ...userOps,
    ...timeSlotOps,
    ...locationOps,
    ...meetingDataOps
  };

  return (
    <MeetingContext.Provider value={contextValue}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    console.error("useMeeting must be used within a MeetingProvider");
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
