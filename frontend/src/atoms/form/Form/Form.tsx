import { PropsWithChildren, useRef, useEffect } from 'react'

type FormProps = {
  className?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const Form = ({ className, onSubmit, children }: PropsWithChildren<FormProps>) => {
  /**
   * Move the focus when 'Enter' key is pressed while focusing 'text'
   */
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const form = formRef.current!

    // Get focusable elements
    const focusEles = Array.from(
      form.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]
    const N = focusEles.length

    // Filter invalid condition
    if (!N) return

    const handleKeydown = (e: KeyboardEvent) => {
      // Check whether 'Enter' is pressed
      if (e.key !== 'Enter') return

      // Check whether the foucsed elements is 'text'
      const activeEle = document.activeElement as HTMLElement
      if (activeEle.tagName !== 'INPUT' || (activeEle as HTMLInputElement).type !== 'text') return

      // Check whether the focused elements is in the current form
      const index = focusEles.indexOf(activeEle)
      if (index === -1 || index === N - 1) return

      // Move the focus
      // https://bobbyhadz.com/blog/focus-not-working-in-javascript
      e.preventDefault()
      setTimeout(() => {
        focusEles[index + 1].focus()
      }, 0)
    }

    // Add event listeners
    focusEles.forEach((ele) => {
      ele.addEventListener('keydown', handleKeydown)
    })

    // Clean up the function
    return () => {
      focusEles.forEach((ele) => {
        ele.removeEventListener('keydown', handleKeydown)
      })
    }
  }, [])

  return (
    <form ref={formRef} className={className} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form
