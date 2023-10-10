/**
 * Throttle the function
 * @param {(any[]) => void} cb callback function to be throttled
 * @returns  optimized function
 */
export default function throttle(cb, delay) {
  if (!cb) {
    throw Error('Invalid required arguments')
  }

  let lastTime = 0

  return function (...args) {
    const now = new Date().getTime()
    if (now - lastTime > delay) {
      cb.apply(this, args)
      lastTime = now
    }
  }
}
