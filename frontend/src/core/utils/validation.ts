/**
 * @utility isValidEmail
 * @summary Validates email format
 * @param email - Email string to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * @utility isValidUrl
 * @summary Validates URL format
 * @param url - URL string to validate
 * @returns True if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error: unknown) {
    return false;
  }
};
