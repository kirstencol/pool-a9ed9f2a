
// src/integrations/supabase/api/timeSlots.ts
import { supabase } from '../client';
import type { TimeSlot } from '@/types';
import { TimeSlotInsert, TimeResponseInsert } from './types';

// Add time slots to a meeting
export async function addTimeSlots(timeSlots: TimeSlotInsert[]): Promise<string[] | null> {
  try {
    console.log("Adding time slots to Supabase:", timeSlots);
    const { data, error } = await supabase
      .from('time_slots')
      .insert(timeSlots)
      .select('id');

    if (error) {
      console.error('Error adding time slots:', error);
      throw error;
    }
    return data.map(slot => slot.id);
  } catch (error) {
    console.error('Error adding time slots:', error);
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

// Get time slots with responses by meeting ID
export async function getTimeSlotsByMeetingId(meetingId: string): Promise<TimeSlot[] | null> {
  try {
    const { data: timeSlotsData, error: timeSlotsError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('meeting_id', meetingId);

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

    return timeSlots;
  } catch (error) {
    console.error('Error getting time slots:', error);
    return null;
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
