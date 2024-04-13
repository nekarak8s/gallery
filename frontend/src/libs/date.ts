/**
 * Returns the elapsed time from a date string
 * @param duration Date string of the event
 * @returns
 */
export function elapsedTimeFromDate(duration: number): TDate {
  const seconds: number = Math.floor(duration / 1000)
  const minutes: number = Math.floor(seconds / 60)
  const hours: number = Math.floor(minutes / 60)
  const days: number = Math.floor(hours / 24)

  return {
    days: days,
    hours: hours % 24,
    minutes: minutes % 60,
    seconds: seconds % 60,
  }
}
