// src/integrations/supabase/api.ts
import { supabase } from './client';
import type { Meeting, TimeSlot, Location, LocationResponse, UserResponse } from '@/types';

// Type definitions for Supabase tables
export type MeetingInsert = {
  creator_name: string;
  creator_initial: string;
  status?: 'draft' | 'pending' | 'confirmed';
  notes?: string;
};

export type ParticipantInsert = {
  meeting_id: string;
  name: string;
  initial: string;
};

export type TimeSlotInsert = {
  meeting_id: string;
  date: string;
  start_time: string;
  end_time: string;
};

export type TimeResponseInsert = {
  time_slot_id: string;
  responder_name: string;
  start_time: string;
  end_time: string;
};

export type LocationInsert = {
  meeting_id: string;
  name: string;
  description?: string;
  suggested_by: string;
};

export type LocationResponseInsert = {
  location_id: string;
  responder_name: string;
  note?: string;
};

// Create a new meeting
export async function createMeeting(meeting: MeetingInsert): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert(meeting)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.error('Error creating meeting:', error);
    return null;
  }
}

// Add participants to a meeting
export async function addParticipants(participants: ParticipantInsert[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('participants')
      .insert(participants);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding participants:', error);
    return false;
  }
}

// Add time slots to a meeting
export async function addTimeSlots(timeSlots: TimeSlotInsert[]): Promise<string[] | null> {
  try {
    const { data, error } = await supabase
      .from('time_slots')
      .insert(timeSlots)
      .select('id');

    if (error) throw error;
    return data.map(slot => slot.id);
  } catch (error) {
    console.error('Error adding time slots:', error);
    return null;
  }
}

// Get meeting by ID with all related data
export async function getMeetingById(id: string): Promise<Meeting | null> {
  try {
    // Get meeting data
    const { data: meetingData, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', id)
      .single();

    if (meetingError) throw meetingError;

    // Get participants
    const { data: participantsData, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .eq('meeting_id', id);

    if (participantsError) throw participantsError;

    // Get time slots with responses
    const { data: timeSlotsData, error: timeSlotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('meeting_id', id);

    if (timeSlotsError) throw timeSlotsError;

    // Get time responses for each time slot
    const timeSlots: TimeSlot[] = await Promise.all(
      timeSlotsData.map(async (slot) => {
        const { data: responsesData, error: responsesError } = await supabase
          .from('time_responses')
          .select('*')
          .eq('time_slot_id', slot.id);

        if (responsesError) throw responsesError;

        return {
          id: slot.id,
          date: slot.date,
          startTime: slot.start_time,
          endTime: slot.end_time,
          responses: responsesData.map(resp => ({
            responderName: resp.responder_name,
            startTime: resp.start_time,
            endTime: resp.end_time
          }))
        };
      })
    );

    // Get locations with responses
    const { data: locationsData, error: locationsError } = await supabase
      .from('locations')
      .select('*')
      .eq('meeting_id', id);

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

    // Find selected time slot and location
    const selectedTimeSlot = timeSlots.find(slot => slot.id === meetingData.selected_time_slot_id) || null;
    const selectedLocation = locations.find(loc => loc.id === meetingData.selected_location_id) || null;

    // Construct the meeting object
    const meeting: Meeting = {
      id: meetingData.id,
      creator: {
        id: 'creator-' + meetingData.id,
        name: meetingData.creator_name,
        initial: meetingData.creator_initial
      },
      participants: participantsData.map(p => ({
        id: p.id,
        name: p.name,
        initial: p.initial
      })),
      timeSlots,
      selectedTimeSlot,
      locations,
      selectedLocation,
      notes: meetingData.notes || '',
      status: meetingData.status
    };

    return meeting;
  } catch (error) {
    console.error('Error getting meeting:', error);
    return null;
  }
}

// Add a time response
export async function addTimeResponse(response: TimeResponseInsert): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('time_responses')
      .insert(response);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error adding time response:', error);
    return false;
  }
}

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

// Update meeting status
export async function updateMeetingStatus(id: string, status: 'draft' | 'pending' | 'confirmed'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating meeting status:', error);
    return false;
  }
}

// Set selected time slot
export async function setSelectedTimeSlot(meetingId: string, timeSlotId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({ selected_time_slot_id: timeSlotId })
      .eq('id', meetingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting selected time slot:', error);
    return false;
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

// Set meeting notes
export async function setMeetingNotes(meetingId: string, notes: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('meetings')
      .update({ notes })
      .eq('id', meetingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error setting meeting notes:', error);
    return false;
  }
}
