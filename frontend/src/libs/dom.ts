export const findFocusEles = (container: HTMLElement) => {
  const focusEles = container.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>

  if (focusEles.length === 0) return false

  return Array.from(focusEles)
}
