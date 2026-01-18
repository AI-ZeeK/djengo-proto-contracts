enum Timeline {
  _1m = "1m",
  _3m = "3m",
  _6m = "6m",
  _1y = "1y",
  all = "all",
}
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
  static getFutureTimestamp({ seconds }: { seconds: number }): Date {
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
      const converted = Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
          Helpers.toSnakeCase(v),
        ]),
      );
      return Helpers.isEmptyOrNull(converted);
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
        ]),
      );
      return Helpers.isEmptyOrNull(converted);
    }
    return obj;
  }

  /**
   * Generates a unique company reference ID with hyphens.
   * Format: XX-CCCCCCss-YY
   * - XX: first 2 letters of company name (uppercase, sanitized)
   * - CCCCCC: 6 random uppercase alphanumeric
   * - ss: 2 random lowercase letters
   * - YY: last 2 digits of current year
   */
  static generateReferenceId({
    company_name,
  }: {
    company_name: string;
  }): string {
    const namePart = company_name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase()
      .slice(0, 2)
      .padEnd(2, "X");
    const now = new Date();
    const yearPart = now.getFullYear().toString().slice(-2);

    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";

    let randomUpper = "";
    for (let i = 0; i < 6; i++) {
      randomUpper += upperChars.charAt(
        Math.floor(Math.random() * upperChars.length),
      );
    }

    let randomLower = "";
    for (let i = 0; i < 2; i++) {
      randomLower += lowerChars.charAt(
        Math.floor(Math.random() * lowerChars.length),
      );
    }

    return `${namePart}-${randomUpper}${randomLower}-${yearPart}`;
  }

  static generateUserSlug(): string {
    // Generate 3 random uppercase letters
    const letters = Array.from({ length: 3 }, () =>
      String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    ).join("");

    // Generate 4 random digits
    const digits = Math.floor(1000 + Math.random() * 9000).toString();

    // Get current date and encode as 4 uppercase letters (e.g., Dec 16, 2025 -> D16Z)
    // We'll use: 1st letter of month, 2-digit day, last char of year (base36)
    const now = new Date();
    const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    const monthLetter = months[now.getMonth()];
    const day = now.getDate().toString().padStart(2, "0");
    const yearChar = now.getFullYear().toString(36).toUpperCase().slice(-1); // base36 for variety
    const datestamp = `${monthLetter}${day}${yearChar}`;

    return `${letters}-${digits}-${datestamp}`;
  }
  static sanitizeUser<T extends object>(
    user: T,
    extraFields: string[] = [],
  ): Partial<T> {
    if (!user) return user;

    const sensitiveFields = ["password", "refresh_token", ...extraFields];
    const sanitized: Record<string, any> = { ...user };

    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = undefined;
      }
    }

    // Always stringify date fields if present
    const dateFields = ["created_at", "last_login", "updated_at"];
    for (const field of dateFields) {
      if (field in sanitized && sanitized[field] != null) {
        if (typeof sanitized[field] !== "string") {
          sanitized[field] = String(sanitized[field]);
        }
      }
    }

    return sanitized as Partial<T>;
  }

  static computeTrend(
    current: number,
    previous: number,
  ): {
    percentage: number;
    trend: "increase" | "decrease" | "neutral";
  } {
    if (previous === 0 && current > 0)
      return { percentage: 100, trend: "neutral" };
    if (previous === 0 && current === 0)
      return { percentage: 0, trend: "neutral" };
    const diff = current - previous;
    const pct = previous !== 0 ? (diff / previous) * 100 : 0;
    let trend: "increase" | "decrease" | "neutral" = "neutral";
    if (pct > 0) trend = "increase";
    else if (pct < 0) trend = "decrease";
    else if (pct === 0) trend = "neutral";
    return { percentage: Math.round(pct * 10) / 10, trend };
  }

  static getDateRanges(timeline: string) {
    const now = new Date();
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;
    let prevDateFrom: Date | undefined;
    let prevDateTo: Date | undefined;

    if (timeline) {
      switch (timeline as Timeline) {
        case Timeline._1m:
          dateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          prevDateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 2,
            now.getDate(),
          );
          prevDateTo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
          );
          break;
        case Timeline._3m:
          dateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate(),
          );
          prevDateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate(),
          );
          prevDateTo = new Date(
            now.getFullYear(),
            now.getMonth() - 3,
            now.getDate(),
          );
          break;
        case Timeline._6m:
          dateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate(),
          );
          prevDateFrom = new Date(
            now.getFullYear(),
            now.getMonth() - 12,
            now.getDate(),
          );
          prevDateTo = new Date(
            now.getFullYear(),
            now.getMonth() - 6,
            now.getDate(),
          );
          break;
        case Timeline._1y:
          dateFrom = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          prevDateFrom = new Date(
            now.getFullYear() - 2,
            now.getMonth(),
            now.getDate(),
          );
          prevDateTo = new Date(
            now.getFullYear() - 1,
            now.getMonth(),
            now.getDate(),
          );
          break;
      }
      dateTo = now;
    }

    return { dateFrom, dateTo, prevDateFrom, prevDateTo };
  }

  static buildWhere(extra: any = {}, dateRange: any) {
    const where: any = { ...extra };
    const { dateFrom, dateTo, prevDateFrom, prevDateTo, usePrev } = dateRange;
    const from = usePrev ? prevDateFrom : dateFrom;
    const to = usePrev ? prevDateTo : dateTo;

    if (from || to) {
      where.created_at = {};
      if (from) where.created_at.gte = from;
      if (to) where.created_at.lte = to;
    }
    return where;
  }
}
