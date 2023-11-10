import { PropsWithChildren, useRef, useEffect } from 'react'

type FormProps = {
  className?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const Form = ({
  className,
  onSubmit,
  children,
}: PropsWithChildren<FormProps>) => {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const form = formRef.current!

    // get focusable elements
    const focusEles = Array.from(
      form.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    const N = focusEles.length

    if (!N) return

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        const activeEle = document.activeElement as HTMLElement

        if (
          activeEle.tagName !== 'INPUT' ||
          (activeEle as HTMLInputElement).type !== 'text'
        )
          return

        const index = focusEles.indexOf(activeEle)

        if (index === -1 || index === N - 1) return

        focusEles[index + 1].focus()
      }
    }

    focusEles.forEach((ele) => {
      ele.addEventListener('keydown', handleKeydown)
    })

    return () => {}
  }, [])

  return (
    <form ref={formRef} className={className} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form
