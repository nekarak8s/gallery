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

/**
 * Return the number with min and max value limitation
 * @param num The number
 * @param min The minimum limit
 * @param max The maximum limit
 * @returns The limited number
 */
export function getLimitedNumber(num: number, min?: number, max?: number) {
  let limitedNum = num

  if (min) {
    limitedNum = Math.max(limitedNum, min)
  }

  if (max) {
    limitedNum = Math.min(limitedNum, max)
  }

  return limitedNum
}
