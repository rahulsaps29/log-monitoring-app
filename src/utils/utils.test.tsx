import { describe, it, expect } from 'vitest';
import { addWarningErrorClass, formatDuration } from './utils';

describe('addWarningErrorClass', () => {
  it('returns "report-warning" for duration > 5 and < 10', () => {
    expect(addWarningErrorClass(6)).toBe("report-warning");
    expect(addWarningErrorClass(9.9)).toBe("report-warning");
  });

  it('returns "report-error" for duration >= 10', () => {
    expect(addWarningErrorClass(10)).toBe("report-error");
    expect(addWarningErrorClass(15)).toBe("report-error");
  });

  it('returns empty string for duration <= 5', () => {
    expect(addWarningErrorClass(5)).toBe('');
    expect(addWarningErrorClass(0)).toBe('');
    expect(addWarningErrorClass(-1)).toBe('');
  });

  it('returns empty string for duration exactly 10 (should be error)', () => {
    expect(addWarningErrorClass(10)).toBe('report-error');
  });

  it('returns empty string for duration exactly 5', () => {
    expect(addWarningErrorClass(5)).toBe('');
  });
});

describe('formatDuration', () => {
  it('formats whole minutes correctly', () => {
    expect(formatDuration(2)).toBe('2 mins');
    expect(formatDuration(1)).toBe('1 min');
  });

  it('formats fractional minutes correctly', () => {
    expect(formatDuration(2.5)).toBe('2 mins and 30 secs');
    expect(formatDuration(1.25)).toBe('1 min and 15 secs');
    expect(formatDuration(0.5)).toBe('30 secs');
    expect(formatDuration(0.75)).toBe('45 secs');
  });

  it('formats zero minutes correctly', () => {
    expect(formatDuration(0)).toBe('0 sec');
  });

  it('formats seconds with correct pluralization', () => {
    expect(formatDuration(0.01)).toBe('1 sec');
    expect(formatDuration(0.02)).toBe('1 sec');
    expect(formatDuration(0.033)).toBe('2 secs');
  })
});