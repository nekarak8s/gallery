/**
 * Page Route
 */
type RouteElement = {
  path: string
  element: React.ReactNode
}

/**
 * Regex
 */
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

/**
 * Three.js Item
 */
type ThreeItem = {
  dispose?: () => void
  update?: (delta: number) => void
}

/**
 * Date
 */
type TDate = {
  days: number
  hours: number
  minutes: number
  seconds: number
}
