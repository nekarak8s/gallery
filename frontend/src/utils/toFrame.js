/**
 * Optimize the callback function to the browser animation frame
 * @param {(any[]) => void} cb callback function to run
 * @param {(any[]) => boolean} dismissCondition condition function to stop the callback
 * @param {(any[]) => boolean} triggerCondition condition function to run the callback
 * @returns  optimized function
 */
export default function toFrame(
  cb,
  dismissCondition = () => false,
  triggerCondition = () => true
) {
  if (!cb) {
    throw Error('Invalid required arguments')
  }

  let isQueue = false

  return function (...args) {
    if (isQueue) return

    isQueue = true
    return requestAnimationFrame(() => {
      if (dismissCondition()) {
        isQueue = false
        return
      }

      if (triggerCondition()) {
        isQueue = false
        return cb.apply(this, args)
      }
    })
  }
}
