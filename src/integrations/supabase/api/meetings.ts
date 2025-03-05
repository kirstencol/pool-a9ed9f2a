
// src/integrations/supabase/api/meetings.ts
import { supabase } from '../client';
import type { Meeting } from '@/types';
import { MeetingInsert } from './types';
import { getParticipantsByMeetingId } from './participants';
import { getTimeSlotsByMeetingId } from './timeSlots';
import { getLocationsByMeetingId } from './locations';

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
    const participantsData = await getParticipantsByMeetingId(id);
    if (!participantsData) throw new Error('Failed to get participants');

    // Get time slots with responses
    const timeSlots = await getTimeSlotsByMeetingId(id);
    if (!timeSlots) throw new Error('Failed to get time slots');

    // Get locations with responses
    const locations = await getLocationsByMeetingId(id);
    if (!locations) throw new Error('Failed to get locations');

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
      participants: participantsData,
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
