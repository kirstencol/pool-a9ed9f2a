
import { describe, it, expect } from 'vitest';
import { 
  isAtMinTime,
  isAtMaxTime
} from '../timeComparison';

describe('timeComparison', () => {
  describe('isAtMinTime', () => {
    it('returns true when time is at minimum allowed time', () => {
      expect(isAtMinTime('9', '00', 'am', '9:00 am')).toBe(true);
      expect(isAtMinTime('8', '45', 'am', '9:00 am')).toBe(true); // Before min time
    });

    it('returns false when time is above minimum allowed time', () => {
      expect(isAtMinTime('9', '15', 'am', '9:00 am')).toBe(false);
      expect(isAtMinTime('10', '00', 'am', '9:00 am')).toBe(false);
    });

    it('handles end time constraints with start time', () => {
      // End time must be after start time
      expect(isAtMinTime('2', '00', 'pm', '9:00 am', true, '2:00 pm')).toBe(true);
      expect(isAtMinTime('1', '45', 'pm', '9:00 am', true, '2:00 pm')).toBe(true); // Before start time
      expect(isAtMinTime('2', '15', 'pm', '9:00 am', true, '2:00 pm')).toBe(false);
    });

    it('uses default min time when not provided', () => {
      expect(isAtMinTime('12', '00', 'am')).toBe(true); // At midnight
      expect(isAtMinTime('12', '01', 'am')).toBe(false); // After midnight
    });
  });

  describe('isAtMaxTime', () => {
    it('returns true when time is at maximum allowed time', () => {
      expect(isAtMaxTime('5', '00', 'pm', '5:00 pm')).toBe(true);
      expect(isAtMaxTime('5', '15', 'pm', '5:00 pm')).toBe(true); // After max time
    });

    it('returns false when time is below maximum allowed time', () => {
      expect(isAtMaxTime('4', '45', 'pm', '5:00 pm')).toBe(false);
      expect(isAtMaxTime('4', '00', 'pm', '5:00 pm')).toBe(false);
    });

    it('uses default max time when not provided', () => {
      expect(isAtMaxTime('11', '59', 'pm')).toBe(true); // At end of day
      expect(isAtMaxTime('11', '58', 'pm')).toBe(false); // Before end of day
    });
  });
});
