export const isValidEmail = (e) => typeof e === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)
export const isValidName = (n) => typeof n === 'string' && /[A-Za-z]/.test(n) && !/\d/.test(n)
export const isValidDOB = (d) => {
  if (!d) return true
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return false
  return dt <= new Date()
}
export const isValidPhone = (p) => {
  if (!p) return false
  const s = String(p).trim()
  return /^\d{10}$/.test(s)
}
