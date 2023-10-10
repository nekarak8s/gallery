/**
 * Get random integer between min ~ max
 * @param min The minimumm integer
 * @param max The maximum integer
 * @returns The radom integer
 */
export function getRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
