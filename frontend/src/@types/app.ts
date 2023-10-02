interface RouteElement {
  path: string
  element: React.ReactNode
}

type PropsWithChildren<P = unknown> = P & { children: React.ReactNode }
