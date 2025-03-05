// src/context/meeting/MeetingContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, TimeSlot, Location, Meeting } from '@/types';
import { MeetingContextType } from './types';
import { 
  createMeeting, 
  addParticipants, 
  addTimeSlots, 
  addTimeResponse, 
  addLocation,
  addLocationResponse,
  getMeetingById,
  setSelectedTimeSlot as dbSetSelectedTimeSlot,
  setSelectedLocation as dbSetSelectedLocation,
  setMeetingNotes as dbSetMeetingNotes,
  updateMeetingStatus
} from '@/integrations/supabase/api';
import { storeMeetingInStorage as storeMeetingToStorage } from './storage';

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateShareableLink = async () => {
    if (currentMeetingId) {
      const baseUrl = window.location.origin;
      const shareableUrl = `${baseUrl}/respond/${currentMeetingId}`;
      return { id: currentMeetingId, url: shareableUrl };
    }

    if (!currentUser) {
      setError('No current user set');
      return { id: '', url: '' };
    }

    setIsLoading(true);
    setError(null);

    try {
      const meetingId = await createMeeting({
        creator_name: currentUser.name,
        creator_initial: currentUser.initial,
        status: 'draft'
      });

      if (!meetingId) {
        throw new Error('Failed to create meeting');
      }

      setCurrentMeetingId(meetingId);

      const allParticipants = [currentUser, ...participants];
      const participantsInsert = allParticipants.map(p => ({
        meeting_id: meetingId,
        name: p.name,
        initial: p.initial
      }));

      const participantsAdded = await addParticipants(participantsInsert);
      if (!participantsAdded) {
        throw new Error('Failed to add participants');
      }

      if (timeSlots.length > 0) {
        const timeSlotsInsert = timeSlots.map(slot => ({
          meeting_id: meetingId,
          date: slot.date,
          start_time: slot.startTime,
          end_time: slot.endTime
        }));

        const timeSlotIds = await addTimeSlots(timeSlotsInsert);
        if (!timeSlotIds) {
          throw new Error('Failed to add time slots');
        }

        const updatedTimeSlots = timeSlots.map((slot, index) => ({
          ...slot,
          id: timeSlotIds[index]
        }));
        setTimeSlots(updatedTimeSlots);
      }

      const baseUrl = window.location.origin;
      const shareableUrl = `${baseUrl}/respond/${meetingId}`;

      return { id: meetingId, url: shareableUrl };
    } catch (err) {
      console.error('Error generating shareable link:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { id: '', url: '' };
    } finally {
      setIsLoading(false);
    }
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

  const addTimeSlot = async (timeSlot: TimeSlot) => {
    if (!currentMeetingId) {
      setTimeSlots(prev => [...prev, { ...timeSlot, id: timeSlot.id || crypto.randomUUID() }]);
      return;
    }

    try {
      const timeSlotId = await addTimeSlots([{
        meeting_id: currentMeetingId,
        date: timeSlot.date,
        start_time: timeSlot.startTime,
        end_time: timeSlot.endTime
      }]);

      if (!timeSlotId || timeSlotId.length === 0) {
        throw new Error('Failed to add time slot');
      }

      setTimeSlots(prev => [...prev, { ...timeSlot, id: timeSlotId[0] }]);
    } catch (err) {
      console.error('Error adding time slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to add time slot');
    }
  };

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(ts => ts.id !== id));
  };

  const clearTimeSlots = () => {
    setTimeSlots([]);
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map(ts => 
      ts.id === id ? { ...ts, ...updates } : ts
    ));
  };

  const addLocationToMeeting = async (location: Location) => {
    if (!currentMeetingId) {
      setLocations([...locations, { ...location, id: crypto.randomUUID() }]);
      return;
    }

    try {
      const locationId = await addLocation({
        meeting_id: currentMeetingId,
        name: location.name,
        description: location.description,
        suggested_by: location.suggestedBy
      });

      if (!locationId) {
        throw new Error('Failed to add location');
      }

      setLocations(prev => [...prev, { ...location, id: locationId }]);
    } catch (err) {
      console.error('Error adding location:', err);
      setError(err instanceof Error ? err.message : 'Failed to add location');
    }
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
    setError(null);
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

  const loadMeetingFromDatabase = async (id: string): Promise<Meeting | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const meeting = await getMeetingById(id);
      
      if (!meeting) {
        throw new Error('Meeting not found');
      }

      if (meeting.creator) {
        setCurrentUser(meeting.creator);
      }
      
      setParticipants(meeting.participants || []);
      setTimeSlots(meeting.timeSlots || []);
      setSelectedTimeSlot(meeting.selectedTimeSlot);
      setLocations(meeting.locations || []);
      setSelectedLocation(meeting.selectedLocation);
      setMeetingNotes(meeting.notes || '');
      setCurrentMeetingId(meeting.id);

      return meeting;
    } catch (err) {
      console.error('Error loading meeting:', err);
      setError(err instanceof Error ? err.message : 'Failed to load meeting');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const respondToTimeSlot = async (timeSlotId: string, responderName: string, startTime: string, endTime: string): Promise<boolean> => {
    try {
      const success = await addTimeResponse({
        time_slot_id: timeSlotId,
        responder_name: responderName,
        start_time: startTime,
        end_time: endTime
      });

      if (!success) {
        throw new Error('Failed to add time response');
      }

      setTimeSlots(prev => prev.map(slot => {
        if (slot.id === timeSlotId) {
          const responses = slot.responses || [];
          return {
            ...slot,
            responses: [
              ...responses,
              {
                responderName,
                startTime,
                endTime
              }
            ]
          };
        }
        return slot;
      }));

      return true;
    } catch (err) {
      console.error('Error responding to time slot:', err);
      setError(err instanceof Error ? err.message : 'Failed to respond to time slot');
      return false;
    }
  };

  const respondToLocation = async (locationId: string, responderName: string, note: string = ''): Promise<boolean> => {
    try {
      const success = await addLocationResponse({
        location_id: locationId,
        responder_name: responderName,
        note
      });

      if (!success) {
        throw new Error('Failed to add location response');
      }

      setLocations(prev => prev.map(loc => {
        if (loc.id === locationId) {
          const responses = loc.responses || [];
          return {
            ...loc,
            responses: [
              ...responses,
              {
                userId: responderName,
                note
              }
            ]
          };
        }
        return loc;
      }));

      return true;
    } catch (err) {
      console.error('Error responding to location:', err);
      setError(err instanceof Error ? err.message : 'Failed to respond to location');
      return false;
    }
  };

  const setSelectedTimeSlotWithDB = async (timeSlot: TimeSlot | null) => {
    setSelectedTimeSlot(timeSlot);
    
    if (currentMeetingId && timeSlot) {
      try {
        await dbSetSelectedTimeSlot(currentMeetingId, timeSlot.id);
        await updateMeetingStatus(currentMeetingId, 'pending');
      } catch (err) {
        console.error('Error setting selected time slot:', err);
      }
    }
  };

  const setSelectedLocationWithDB = async (location: Location | null) => {
    setSelectedLocation(location);
    
    if (currentMeetingId && location) {
      try {
        await dbSetSelectedLocation(currentMeetingId, location.id);
        await updateMeetingStatus(currentMeetingId, 'confirmed');
      } catch (err) {
        console.error('Error setting selected location:', err);
      }
    }
  };

  const setMeetingNotesWithDB = async (notes: string) => {
    setMeetingNotes(notes);
    
    if (currentMeetingId) {
      try {
        await dbSetMeetingNotes(currentMeetingId, notes);
      } catch (err) {
        console.error('Error setting meeting notes:', err);
      }
    }
  };

  const storeMeetingInStorage = async (id: string, meetingData: Partial<StoredMeeting>): Promise<boolean> => {
    try {
      return await storeMeetingToStorage(id, meetingData);
    } catch (error) {
      console.error('Error storing meeting data:', error);
      setError(error instanceof Error ? error.message : 'Unknown error storing meeting data');
      return false;
    }
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
      setSelectedTimeSlot: setSelectedTimeSlotWithDB,
      locations,
      addLocation: addLocationToMeeting,
      removeLocation,
      selectedLocation,
      setSelectedLocation: setSelectedLocationWithDB,
      meetingNotes,
      setMeetingNotes: setMeetingNotesWithDB,
      clearMeetingData,
      clearTimeSlots,
      getMeetingData,
      generateShareableLink,
      loadMeetingFromStorage: loadMeetingFromDatabase,
      respondToTimeSlot,
      respondToLocation,
      storeMeetingInStorage,
      isLoading,
      error
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
