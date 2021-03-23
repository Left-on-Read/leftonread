const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(email: string) {
  if (!basicEmailRegex.test(email)) {
    return false
  }

  return true
}
