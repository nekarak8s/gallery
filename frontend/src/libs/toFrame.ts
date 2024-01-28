/**
 * Optimize the callback function to the browser animation frame
 * @param cb callback function to run
 * @param dismissCondition condition function to stop the callback
 * @param triggerCondition condition function to run the callback
 * @returns  optimized function
 */
export default function toFrame(
  cb: (...args: any[]) => void,
  dismissCondition: (...args: any[]) => boolean = () => false,
  triggerCondition: (...args: any[]) => boolean = () => true
) {
  if (!cb) {
    throw Error('Invalid required arguments')
  }

  let isQueue = false

  return function (...args: any[]) {
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
