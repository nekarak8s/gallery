import { PropsWithChildren } from 'react'

type FormProps = {
  className?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

const Form = ({ className, onSubmit, children }: PropsWithChildren<FormProps>) => {
  return (
    <form className={className} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

export default Form
