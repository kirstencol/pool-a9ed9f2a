
import { describe, it, expect } from 'vitest';
import { 
  incrementTime,
  decrementTime
} from '../timeIncrement';

describe('timeIncrement', () => {
  describe('incrementTime', () => {
    it('increments time by 15 minutes', () => {
      expect(incrementTime('1', '00', 'pm')).toEqual({ hour: '1', minute: '15', period: 'pm' });
      expect(incrementTime('1', '15', 'pm')).toEqual({ hour: '1', minute: '30', period: 'pm' });
      expect(incrementTime('1', '30', 'pm')).toEqual({ hour: '1', minute: '45', period: 'pm' });
      expect(incrementTime('1', '45', 'pm')).toEqual({ hour: '2', minute: '00', period: 'pm' });
    });

    it('handles hour transitions correctly', () => {
      expect(incrementTime('11', '45', 'am')).toEqual({ hour: '12', minute: '00', period: 'pm' });
      expect(incrementTime('11', '45', 'pm')).toEqual({ hour: '12', minute: '00', period: 'am' });
      expect(incrementTime('12', '45', 'am')).toEqual({ hour: '1', minute: '00', period: 'am' });
      expect(incrementTime('12', '45', 'pm')).toEqual({ hour: '1', minute: '00', period: 'pm' });
    });

    it('respects maximum time constraints', () => {
      // At max time limit
      expect(incrementTime('5', '00', 'pm', '5:00 pm')).toBeNull();
      // Before max time limit
      expect(incrementTime('4', '45', 'pm', '5:00 pm')).toEqual({ hour: '5', minute: '00', period: 'pm' });
    });
  });

  describe('decrementTime', () => {
    it('decrements time by 15 minutes', () => {
      expect(decrementTime('2', '00', 'pm')).toEqual({ hour: '1', minute: '45', period: 'pm' });
      expect(decrementTime('1', '45', 'pm')).toEqual({ hour: '1', minute: '30', period: 'pm' });
      expect(decrementTime('1', '30', 'pm')).toEqual({ hour: '1', minute: '15', period: 'pm' });
      expect(decrementTime('1', '15', 'pm')).toEqual({ hour: '1', minute: '00', period: 'pm' });
    });

    it('handles hour transitions correctly', () => {
      expect(decrementTime('12', '00', 'pm')).toEqual({ hour: '11', minute: '45', period: 'am' });
      expect(decrementTime('12', '00', 'am')).toEqual({ hour: '11', minute: '45', period: 'pm' });
      expect(decrementTime('1', '00', 'am')).toEqual({ hour: '12', minute: '45', period: 'am' });
      expect(decrementTime('1', '00', 'pm')).toEqual({ hour: '12', minute: '45', period: 'pm' });
    });

    it('respects minimum time constraints', () => {
      // At min time limit
      expect(decrementTime('9', '00', 'am', '9:00 am')).toBeNull();
      // After min time limit
      expect(decrementTime('9', '15', 'am', '9:00 am')).toEqual({ hour: '9', minute: '00', period: 'am' });
    });

    it('handles end time with start time constraints', () => {
      // End time must be after start time
      expect(decrementTime('2', '15', 'pm', undefined, true, '2:00 pm')).toEqual({ hour: '2', minute: '00', period: 'pm' });
      expect(decrementTime('2', '00', 'pm', undefined, true, '2:00 pm')).toBeNull();
    });
  });
});
