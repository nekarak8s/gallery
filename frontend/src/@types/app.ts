type RouteElement = {
  path: string
  element: React.ReactNode
}

type RegexCondition = {
  regex: RegExp
  condition: string
}

type RegexPass<T = any> = {
  result: true
  data: T
}

type RegexFail = {
  result: false
  reason: string
}

type RegexResult<T = any> = RegexPass<T> | RegexFail

type ThreeItem = {
  dispose?: () => void
  update?: ((delta: number) => void) | (() => void)
}
