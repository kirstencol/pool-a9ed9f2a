
import { describe, it, expect } from 'vitest';
import * as timeUtils from '../index';

describe('Time Utils Index', () => {
  it('exports timeFormatting utilities', () => {
    expect(timeUtils.timeToMinutes).toBeDefined();
    expect(timeUtils.parseTimeString).toBeDefined();
    expect(timeUtils.buildTimeString).toBeDefined();
  });

  it('exports timeComparison utilities', () => {
    expect(timeUtils.isAtMinTime).toBeDefined();
    expect(timeUtils.isAtMaxTime).toBeDefined();
  });

  it('exports timeIncrement utilities', () => {
    expect(timeUtils.incrementTime).toBeDefined();
    expect(timeUtils.decrementTime).toBeDefined();
  });
});
