interface RouteElement {
  path: string
  element: React.ReactNode
}

type PropsWithChildren<P = unknown> = P & { children: React.ReactNode }

interface Regex {
  reg: RegExp
  con: string
}

interface ValidateOutput {
  result: boolean
  reason?: string
  data?: object
}
