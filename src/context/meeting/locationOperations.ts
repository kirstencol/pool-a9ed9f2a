
// src/context/meeting/locationOperations.ts
import { Location } from '@/types';
import { MeetingContextState, LocationOperations } from './types';
import { addLocation as addLocationToDb, addLocationResponse, dbSetSelectedLocation, updateMeetingStatus } from '@/integrations/supabase/api';

type StateSetters = {
  setLocations: (locations: Location[]) => void;
  setSelectedLocation: (location: Location | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  [key: string]: any;
};

export const useLocationOperations = (
  state: MeetingContextState,
  stateSetters: StateSetters
): LocationOperations => {
  const { 
    setLocations, 
    setSelectedLocation, 
    setIsLoading, 
    setError 
  } = stateSetters;
  
  const { locations, currentMeetingId } = state;

  const addLocation = async (location: Location) => {
    if (!currentMeetingId) {
      setLocations([...locations, { ...location, id: crypto.randomUUID() }]);
      return;
    }

    try {
      const locationId = await addLocationToDb({
        meeting_id: currentMeetingId,
        name: location.name,
        description: location.description,
        suggested_by: location.suggestedBy
      });

      if (!locationId) {
        throw new Error('Failed to add location');
      }

      setLocations([...locations, { ...location, id: locationId }]);
    } catch (err) {
      console.error('Error adding location:', err);
      setError(err instanceof Error ? err.message : 'Failed to add location');
    }
  };

  const removeLocation = (id: string) => {
    setLocations(locations.filter(l => l.id !== id));
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

  const respondToLocation = async (locationId: string, responderName: string, note: string = ''): Promise<boolean> => {
    try {
      setIsLoading(true);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addLocation,
    removeLocation,
    setSelectedLocation: setSelectedLocationWithDB,
    respondToLocation
  };
};
