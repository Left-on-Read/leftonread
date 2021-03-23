import { isValidEmail } from './validation'

describe('test isValidEmail', () => {
  it('should accept valid emails', () => {
    expect(isValidEmail('test@gmail.com')).toBe(true)
    expect(isValidEmail('ted.darific@hotmail.net')).toBe(true)
    expect(isValidEmail('ted13_+12@yahoo.com')).toBe(true)
    expect(isValidEmail('132312@bil.org')).toBe(true)
  })

  it('should fail invalid emails', () => {
    expect(isValidEmail('test')).toBe(false)
    expect(isValidEmail('test@')).toBe(false)
    expect(isValidEmail('test@gmail')).toBe(false)
    expect(isValidEmail('@gmail.com')).toBe(false)
    expect(isValidEmail('@')).toBe(false)
  })
})
