export function isNumber(n: unknown): n is number {
  return typeof n === 'number'
}
export function isString(s: unknown): s is string {
  if (Array.isArray(s)) {
    return typeof s[0] === 'string'
  }
  return typeof s === 'string'
}
