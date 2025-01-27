import {
  validateLogin,
  validatePassword,
  validateUsername,
} from '../src/utils/auth-utils';

describe('validateLogin', () => {
  it('should return true for valid email', () => {
    expect(validateLogin('test@example.com')).toBe(true);
  });
  it('should return false for invalid email', () => {
    expect(validateLogin('test@com')).toBe(false);
  });
  it('should return true for valid phone number', () => {
    expect(validateLogin('+1234567890')).toBe(true);
  });
  it('should return false for empty string', () => {
    expect(validateLogin('')).toBe(false);
  });
  it('should return true for valid phone number with country code', () => {
    expect(validateLogin('+12345678901234')).toBe(true);
  });
});
describe('validatePassword', () => {
  it('should return true for passwords with 8 or more characters', () => {
    expect(validatePassword('password123')).toBe(true);
    expect(validatePassword('abcdefgh')).toBe(true);
  });
  it('should return false for passwords with less than 8 characters', () => {
    expect(validatePassword('short')).toBe(false);
  });
});
describe('validateUsername', () => {
  it('should return true for valid username', () => {
    expect(validateUsername('valid_username')).toBe(true);
    expect(validateUsername('user123')).toBe(true);
  });
  it('should return false for invalid username (less than 5 characters)', () => {
    expect(validateUsername('usr')).toBe(false);
  });
  it('should return false for invalid username (more than 20 characters)', () => {
    expect(validateUsername('this_is_a_very_long_username')).toBe(
      false
    );
  });
  it('should return true for username with exactly 5 characters', () => {
    expect(validateUsername('user1')).toBe(true);
  });
  it('should return true for username with exactly 20 characters', () => {
    expect(validateUsername('username_is_20char')).toBe(true);
  });
  it('should return false for username containing invalid characters', () => {
    expect(validateUsername('invalid-username')).toBe(false);
    expect(validateUsername('invalid@username')).toBe(false);
  });
  it('should return false for username with spaces', () => {
    expect(validateUsername('invalid username')).toBe(false);
  });
  it('should return true for username with underscores and numbers', () => {
    expect(validateUsername('valid_username_123')).toBe(true);
  });
  it('should return false for username with special characters', () => {
    expect(validateUsername('invalid@username')).toBe(false);
  });
});
