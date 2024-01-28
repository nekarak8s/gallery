/**
 * Throttle the function
 * @param cb function to be throttled
 * @param delay time for throttle
 * @returns  optimized function
 */
export default function throttle(cb: (...args: any[]) => void, delay: number = 300) {
  if (!cb) {
    throw Error('Invalid required arguments')
  }

  let lastTime = 0

  return function (...args: any[]) {
    const now = new Date().getTime()
    if (now - lastTime > delay) {
      cb.apply(this, args)
      lastTime = now
    }
  }
}
