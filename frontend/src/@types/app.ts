type RouteElement = {
  path: string
  element: React.ReactNode
}

type RegexCondition = {
  reg: RegExp
  con: string
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
