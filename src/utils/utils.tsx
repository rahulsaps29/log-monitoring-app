/**
 * Returns a CSS class name based on the provided duration value.
 *
 * - If the duration is greater than 5 and less than 10, returns `"report-warning"`.
 * - If the duration is greater than or equal to 10, returns `"report-error"`.
 *
 * @param duration - The duration value to evaluate.
 * @returns The corresponding CSS class name
 */
  export const addWarningErrorClass = (duration: number) => {
    if (duration > 5 && duration < 10) {
      return "report-warning";
    } else if (duration >= 10) {
      return "report-error";
    }
    return ''
  };


  /**
 * Formats a duration given in minutes as a human-readable string.
 * 
 * @param durationInMin - The duration in minutes (can be a fractional number).
 * @returns A formatted string representing the duration in minutes and seconds.
 *
 * @example
 * formatDuration(2.5); // "2 mins and 30 secs"
 */
export const formatDuration = (durationInMin: number): string => {
  const minutes = Math.floor(durationInMin)
  const seconds = Math.round((durationInMin - minutes) * 60)
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? "s" : ""}${
      seconds > 0 ? ` and ${seconds} sec${seconds > 1 ? "s" : ""}` : ""
    }`;
  } else {
    return `${seconds} sec${seconds > 1 ? "s" : ""}`;
  }
}