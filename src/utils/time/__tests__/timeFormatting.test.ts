
import { describe, it, expect } from 'vitest';
import { 
  timeToMinutes,
  parseTimeString,
  buildTimeString
} from '../timeFormatting';

describe('timeFormatting', () => {
  describe('timeToMinutes', () => {
    it('converts AM times correctly', () => {
      expect(timeToMinutes('12:00 am')).toBe(0);
      expect(timeToMinutes('1:30 am')).toBe(90);
      expect(timeToMinutes('11:45 am')).toBe(11 * 60 + 45);
    });

    it('converts PM times correctly', () => {
      expect(timeToMinutes('12:00 pm')).toBe(12 * 60);
      expect(timeToMinutes('1:30 pm')).toBe(13 * 60 + 30);
      expect(timeToMinutes('11:45 pm')).toBe(23 * 60 + 45);
    });

    it('handles invalid inputs gracefully', () => {
      expect(timeToMinutes('')).toBe(0);
      expect(timeToMinutes('--')).toBe(0);
      expect(timeToMinutes('invalid')).toBe(0);
    });
  });

  describe('parseTimeString', () => {
    it('parses valid time strings correctly', () => {
      expect(parseTimeString('1:30 am')).toEqual({ hour: '1', minute: '30', period: 'am' });
      expect(parseTimeString('12:00 pm')).toEqual({ hour: '12', minute: '00', period: 'pm' });
      expect(parseTimeString('11:45 PM')).toEqual({ hour: '11', minute: '45', period: 'pm' });
    });

    it('returns default values for invalid inputs', () => {
      expect(parseTimeString('invalid')).toEqual({ hour: '12', minute: '00', period: 'pm' });
    });
  });

  describe('buildTimeString', () => {
    it('builds time strings correctly', () => {
      expect(buildTimeString('1', '30', 'am')).toBe('1:30 am');
      expect(buildTimeString('12', '00', 'pm')).toBe('12:00 pm');
      expect(buildTimeString('11', '45', 'PM')).toBe('11:45 pm');
    });

    it('pads minutes with leading zeros when needed', () => {
      expect(buildTimeString('1', '5', 'am')).toBe('1:05 am');
      expect(buildTimeString('12', '0', 'pm')).toBe('12:00 pm');
    });

    it('trims whitespace from inputs', () => {
      expect(buildTimeString(' 1 ', ' 30 ', ' am ')).toBe('1:30 am');
    });
  });
});
