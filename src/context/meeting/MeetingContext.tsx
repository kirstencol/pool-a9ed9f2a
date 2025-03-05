
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, TimeSlot, Location, Meeting } from '@/types';
import { MeetingContextType, StoredMeeting } from './types';
import { 
  storeMeetingInStorage, 
  loadMeetingFromStorage, 
  generateUniqueId,
  initializeDemoData 
} from './storage';

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const MeetingProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [meetingNotes, setMeetingNotes] = useState<string>('');
  const [currentMeetingId, setCurrentMeetingId] = useState<string>('');

  useEffect(() => {
    initializeDemoData();
  }, []);

  const generateShareableLink = () => {
    const meetingId = currentMeetingId || generateUniqueId();
    
    if (!currentMeetingId) {
      setCurrentMeetingId(meetingId);
    }
    
    const meetingData = getMeetingData();
    
    storeMeetingInStorage(meetingId, meetingData);
    
    const baseUrl = window.location.origin;
    const shareableUrl = `${baseUrl}/respond/${meetingId}`;
    
    return { id: meetingId, url: shareableUrl };
  };

  const addParticipant = (name: string) => {
    const newParticipant: User = {
      id: crypto.randomUUID(),
      name,
      initial: name.charAt(0).toUpperCase(),
    };
    setParticipants([...participants, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const addTimeSlot = (timeSlot: TimeSlot) => {
    console.log("Adding time slot:", timeSlot);
    // Check if this slot ID already exists to prevent duplicates
    if (!timeSlots.some(ts => ts.id === timeSlot.id)) {
      setTimeSlots(prev => [...prev, { ...timeSlot, id: timeSlot.id || crypto.randomUUID() }]);
    } else {
      console.log("Time slot with ID", timeSlot.id, "already exists, skipping");
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
  };

  const clearTimeSlots = () => {
    console.log("Clearing all time slots");
    setTimeSlots([]);
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(ts => 
      ts.id === id ? { ...ts, ...updates } : ts
    ));
  };

  const addLocation = (location: Location) => {
    setLocations([...locations, { ...location, id: crypto.randomUUID() }]);
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
  };

  const clearMeetingData = () => {
    setParticipants([]);
    setTimeSlots([]);
    setSelectedTimeSlot(null);
    setLocations([]);
    setSelectedLocation(null);
    setMeetingNotes('');
    setCurrentMeetingId('');
  };

  const getMeetingData = (): Partial<Meeting> => {
    if (!currentUser) return {};
    
    return {
      creator: currentUser,
      participants,
      timeSlots,
      selectedTimeSlot,
      locations,
      selectedLocation,
      notes: meetingNotes,
      status: selectedLocation ? 'confirmed' : selectedTimeSlot ? 'pending' : 'draft'
    };
  };

  return (
    <MeetingContext.Provider value={{
      currentUser,
      setCurrentUser,
      participants,
      addParticipant,
      removeParticipant,
      timeSlots,
      addTimeSlot,
      removeTimeSlot,
      updateTimeSlot,
      selectedTimeSlot,
      setSelectedTimeSlot,
      locations,
      addLocation,
      removeLocation,
      selectedLocation,
      setSelectedLocation,
      meetingNotes,
      setMeetingNotes,
      clearMeetingData,
      clearTimeSlots,
      getMeetingData,
      generateShareableLink,
      storeMeetingInStorage,
      loadMeetingFromStorage
    }}>
      {children}
    </MeetingContext.Provider>
  );
};

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (context === undefined) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};
