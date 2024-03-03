/**
 * Throttle the function
 * @param cb function to be throttled
 * @param delay time for debounce
 * @returns  optimized function
 */
export default function debounce(cb: (...args: any[]) => void, delay: number = 300) {
  if (!cb) {
    throw Error('Invalid required arguments')
  }

  let timer: ReturnType<typeof setTimeout> | undefined
  return (...args: any[]) => {
    if (!timer) {
      cb.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
    }, delay)
  }
}
