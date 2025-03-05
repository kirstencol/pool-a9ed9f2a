
// src/integrations/supabase/api/locations.ts
import { supabase } from '../client';
import type { Location } from '@/types';
import { LocationInsert, LocationResponseInsert } from './types';

// Add a location
export async function addLocation(location: LocationInsert): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('locations')
      .insert(location)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error adding location:', error);
    return null;
  }
}

// Add a location response
export async function addLocationResponse(response: LocationResponseInsert): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('location_responses')
      .insert(response);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding location response:', error);
    return false;
  }
}

// Get locations with responses by meeting ID
export async function getLocationsByMeetingId(meetingId: string): Promise<Location[] | null> {
  try {
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('*')
      .eq('meeting_id', meetingId);

    if (locationsError) throw locationsError;

    // Get location responses for each location
    const locations: Location[] = await Promise.all(
      locationsData.map(async (loc) => {
        const { data: locationResponsesData, error: locationResponsesError } = await supabase
          .from('location_responses')
          .select('*')
          .eq('location_id', loc.id);

        if (locationResponsesError) throw locationResponsesError;

        return {
          id: loc.id,
          name: loc.name,
          description: loc.description || '',
          suggestedBy: loc.suggested_by,
          responses: locationResponsesData.map(resp => ({
            userId: resp.responder_name,
            responderName: resp.responder_name,
            note: resp.note || ''
          }))
        };
      })
    );

    return locations;
  } catch (error) {
    console.error('Error getting locations:', error);
    return null;
  }
}

// Set selected location
export async function setSelectedLocation(meetingId: string, locationId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({ selected_location_id: locationId })
      .eq('id', meetingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting selected location:', error);
    return false;
  }
}
