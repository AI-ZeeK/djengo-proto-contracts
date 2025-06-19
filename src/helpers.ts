export class Helpers {
  /**
   * Generates a random OTP (One-Time Password)
   * @param options Configuration options for OTP generation
   * @returns Generated OTP string
   */
  static generateOTP({
    length = 6,
    options = {
      numbers: true,
      uppercase: false,
      lowercase: false,
    },
  }: {
    length?: number;
    options?: {
      numbers?: boolean;
      uppercase?: boolean;
      lowercase?: boolean;
    };
  }): string {
    const { numbers, uppercase, lowercase } = options;

    let characters = "";
    if (numbers) characters += "0123456789";
    if (uppercase) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) characters += "abcdefghijklmnopqrstuvwxyz";

    if (!characters) {
      throw new Error("At least one character type must be enabled.");
    }

    let otp = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }

    return otp;
  }

  /**
   * Generates a future timestamp based on the given number of seconds
   * @param seconds Number of seconds to add to current time
   * @returns Future Date object
   */
  static getFutureTimestamp(seconds: number): Date {
    const now = new Date();
    return new Date(now.getTime() + seconds * 1000);
  }

  /**
   * Generates a unique value with a prefix
   * @param value Base value to generate unique identifier from
   * @returns Unique string with prefix
   */
  static generateUniqueValue(value: string): string {
    const prefix = value.slice(0, 3).toUpperCase();
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`;
  }

  /**
   * Validates an email address format
   * @param email Email address to validate
   * @returns boolean indicating if email is valid
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Formats a phone number to a standard format
   * @param phone Phone number to format
   * @returns Formatted phone number
   */
  static formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, "");

    // Format based on length
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
      return `+${cleaned}`;
    }
    return `+${cleaned}`;
  }

  /**
   * Generates a random password with specified requirements
   * @param length Length of the password
   * @returns Generated password
   */
  static generatePassword(length: number = 12): string {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    const allChars = uppercase + lowercase + numbers + symbols;
    let password = "";

    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  /**
   * Sanitizes a string by removing potentially harmful characters
   * @param input String to sanitize
   * @returns Sanitized string
   */
  static sanitizeString(input: string): string {
    return input
      .replace(/[<>]/g, "") // Remove < and >
      .replace(/javascript:/gi, "") // Remove javascript: protocol
      .replace(/on\w+=/gi, "") // Remove on* attributes
      .trim();
  }

  /**
   * Checks if an object is empty. If so, returns null; otherwise, returns the object
   */
  static isEmptyOrNull<T extends object>(obj: T): T | null {
    if (
      obj &&
      typeof obj === "object" &&
      !Array.isArray(obj) &&
      Object.keys(obj).length === 0
    ) {
      return null;
    }
    return obj;
  }

  /**
   * Converts object keys to snake_case recursively, and converts empty objects to null.
   */
  static toSnakeCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(Helpers.toSnakeCase);
    } else if (obj !== null && typeof obj === "object") {
      // Convert all values recursively, then check if result is empty
      const converted = Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
          Helpers.toSnakeCase(v),
        ])
      );
      return this.isEmptyOrNull(converted);
    }
    return obj;
  }

  /**
   * Converts object keys to camelCase recursively, and converts empty objects to null.
   */
  static toCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(Helpers.toCamelCase);
    } else if (obj !== null && typeof obj === "object") {
      const converted = Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
          Helpers.toCamelCase(v),
        ])
      );
      return this.isEmptyOrNull(converted);
    }
    return obj;
  }
}
