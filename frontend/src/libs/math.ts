/**
 * Get random integer between min ~ max
 * @param min The minimum integer
 * @param max The maximum integer
 * @returns The radom integer
 */
export function getRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Get random number between min ~ max
 * @param min The minimum number
 * @param max The maximum number
 * @returns The radom number
 */
export function getRandom(min: number, max: number) {
  return Math.random() * (max - min + 1) + min
}
