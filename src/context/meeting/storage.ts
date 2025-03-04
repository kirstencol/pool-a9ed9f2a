
import { StoredMeeting } from './types';

export const STORAGE_KEY_PREFIX = 'meetup_app_';

export const storeMeetingInStorage = (id: string, meeting: StoredMeeting): boolean => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
    localStorage.setItem(storageKey, JSON.stringify(meeting));
    console.log(`Meeting data stored with key: ${storageKey}`);
    return true;
  } catch (error) {
    console.error('Error storing meeting data:', error);
    return false;
  }
};

export const loadMeetingFromStorage = (id: string): StoredMeeting | null => {
  try {
    const storageKey = `${STORAGE_KEY_PREFIX}${id}`;
    const storedData = localStorage.getItem(storageKey);
    
    if (!storedData) return null;
    
    return JSON.parse(storedData) as StoredMeeting;
  } catch (error) {
    console.error('Error loading meeting data:', error);
    return null;
  }
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};
